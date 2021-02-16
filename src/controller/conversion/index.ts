import {
	Body,
	Controller,
	Get,
	Path,
	Post,
	Route,
	Tags
} from "tsoa"
import { ConversionService } from "../../service/conversion"
import { EHttpResponseCodes } from "../../constants"
import {
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequestBody,
	IConversionStatus
} from "../../service/conversion/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../../service/logger"
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
			return this.conversionService.getConvertedFile(fileId)
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
}