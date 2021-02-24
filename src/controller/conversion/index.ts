import {
	Body,
	Controller,
	Get,
	Path,
	Post,
	Request,
	Route,
	Tags
} from "tsoa"
import { ConversionService } from "../../service/conversion"
import { Duplex } from "stream"
import { EHttpResponseCodes } from "../../constants"
import {
	IConversionFinished,
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequestBody,
	IConversionStatus
} from "../../service/conversion/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../../service/logger"
import { getType } from "mime"
import express from "express"
import fs from "fs"
import multer from "multer"
@Route("/conversion")
@Tags("Conversion")
export class ConversionController extends Controller {
	@Inject
	private readonly conversionService!: ConversionService
	@Inject
	private readonly logger!: Logger
	/**
	 * Adds the file from the request body to the internal conversion queue.
	 * The files in queue will be processed after the FIFO principle.
	 * @param conversionRequestBody	contains the file to convert
	 */
	@Post("/")
	public async convertFile(
		@Body() conversionRequestBody: IConversionRequestBody
	): Promise<IConversionProcessingResponse> {
		const {
			filename,
			originalFormat,
			targetFormat
		} = conversionRequestBody
		// Removes extension from filename if there is one
		const rawFilename = filename.replace(/(\.([^. \n]+))/g, "")
		this.logger.log(`Conversion requested for:\n${rawFilename}.${originalFormat} --> ${targetFormat}`)
		return await this.conversionService.processConversionRequest({
			...conversionRequestBody,
			filename: rawFilename
		})
	}
	/**
	 * Adds the file from the request body to the internal conversion queue.
	 * The files in queue will be processed after the FIFO principle.
	 * @param conversionRequestBody	contains the file to convert
	 */
	@Post("/upload")
	public async convertFileUpload(
		@Request() request: express.Request
	): Promise<IConversionProcessingResponse> {
		this.logger.log("Conversion requested")
		const conversionRequest = await this.handleMultipartFormData(request)
		return await this.conversionService.processConversionRequest(conversionRequest)
	}
	/**
	 * Retrieves the status of the conversion queue and returns all conversions with
	 * their corresponding status and the amount of outstanding conversions.
	 */
	@Get("/")
	public getConversionQueueStatus(): IConversionQueueStatus {
		this.logger.log("Conversion queue status requested")
		return this.conversionService.getConversionQueueStatus()
	}
	/**
	 * Returns the current status for a conversion given a conversionId
	 * @param fileId Unique identifier for the conversion of a file.
	 */
	@Get("{fileId}")
	public getConvertedFile(@Path() fileId: string): IConversionStatus {
		try {
			this.logger.log(`Conversion status requested for conversionId: ${fileId}`)
			return this.conversionService.getConversionStatus(fileId)
		}
		catch (err) {
			this.logger.error(
				`[CRITICAL] Given conversionId (${fileId}) could not be found. Error message: ${err.message}`
			)
			this.setStatus(EHttpResponseCodes.notFound)
			return {
				conversionId: fileId,
				failures: 0,
				status: err.message
			}
		}
	}
	/**
	 * Returns the current status for a conversion given a conversionId
	 * If status is 'converted' the resulting converted file
	 * will be available to download.
	 * @param conversionId the id of the file-conversion that is requested
	 */
	@Get("{conversionId}/download")
	public async getConvertedFileDownload(
		@Path() conversionId: string
	): Promise<unknown> {
		try {
			const conversionStatusResult = this.conversionService.getConversionStatus(conversionId)
			const {
				conversionId: fileId,
				status
			} = conversionStatusResult
			this.setStatus(EHttpResponseCodes.ok)
			if (status === "converted") {
				const fileName = `${fileId}.pdf`
				const filePath = `./out/${fileName}`
				const stats: fs.Stats = await fs.promises.stat(filePath)
				this.setHeader("Content-Type", `${getType(filePath)}`)
				this.setHeader("Content-Length", stats.size.toString())
				// Removing this line will cause to not launch the download
				// Just serves the file as it is
				this.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
				const stream = new Duplex()
				stream.push((conversionStatusResult as IConversionFinished).resultFile)
				stream.push(null)
				return stream
			}
			return {
				conversionId,
				status
			}
		}
		catch (err) {
			this.setStatus(EHttpResponseCodes.notFound)
			return {
				conversionId,
				status: err.message
			}
		}
	}
	/**
	 * Handles file-uploads with multipart/formData requests.
	 */
	private async handleMultipartFormData(
		request: express.Request
	): Promise<IConversionRequestBody> {
		const multerSingle = multer().single("conversionFile")
		return new Promise((resolve, reject) => {
			multerSingle(request, express.response, (error: unknown) => {
				if (error) {
					reject(error)
				}
				const {
					originalFormat,
					targetFormat
				} = request?.body
				const {
					file
				} = request
				resolve({
					file: file.buffer,
					filename: file.originalname,
					originalFormat,
					targetFormat
				})
			})
		})
	}
}