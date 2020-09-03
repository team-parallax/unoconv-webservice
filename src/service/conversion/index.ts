import { ConversionQueueService } from "./conversionQueue"
import {
	IConversionProcessingResponse,
	IConversionRequest,
	IConversionRequestBody,
	IConversionStatusResponse
} from "./interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../logger"
import { UnoconvService } from "../unoconv"
import { v4 as uuidV4 } from "uuid"
import { writeToFile } from "../file-io"
export class ConversionService {
	@Inject
	private readonly conversionQueueService!: ConversionQueueService
	private readonly logger: Logger
	constructor() {
		this.conversionQueueService = new ConversionQueueService()
		this.logger = new Logger()
	}
	public addToConversionQueue(requestObject: IConversionRequest): IConversionProcessingResponse {
		const {
			conversionId
		} = this.conversionQueueService.addToConversionQueue(requestObject)
		// eslint-disable-next-line no-void
		void this.update()
		return {
			conversionId
		}
	}
	async convertFile(): Promise<void> {
		const fileToProcess = this.conversionQueueService.getNextQueueElement()
		if (fileToProcess) {
			this.logger.log(`Trying to convert ${fileToProcess.conversionId}`)
			this.conversionQueueService.isCurrentlyConverting = true
			this.conversionQueueService.currentlyConvertingFile = fileToProcess
			try {
				const resp = await UnoconvService.convertToTarget({
					conversionId: fileToProcess.conversionId,
					filePath: fileToProcess.path,
					outputFilename: fileToProcess.name,
					targetFormat: fileToProcess.targetFormat
				})
				this.conversionQueueService.addToConvertedQueue(
					fileToProcess,
					resp.path
				)
				this.logger.log(
					`Conversion done for ${fileToProcess.conversionId}. Wrote data to ${resp.path}.`
				)
			}
			catch (err) {
				this.logger.error(err)
			}
			finally {
				this.isCurrentlyConverting = false
				// eslint-disable-next-line no-void
				void this.update()
			}
		}
	}
	public getConvertedFile(fileId: string): IConversionStatusResponse {
		// Todo: Delete corresponding input file when conversionQueueService returns 'converted' status
		return this.conversionQueueService.getStatusById(fileId)
	}
	public async processConversionRequest({
		file,
		filename,
		originalFormat,
		targetFormat
	}: IConversionRequestBody): Promise<IConversionProcessingResponse> {
		const conversionId = uuidV4()
		const inPath = `./input/${conversionId}.${originalFormat}`
		await writeToFile(inPath, file)
		const request: IConversionRequest = {
			conversionId,
			isConverted: false,
			name: filename,
			path: inPath,
			targetFormat
		}
		return this.addToConversionQueue(request)
	}
	private async update(): Promise<void> {
		if (!this.isCurrentlyConverting) {
			return await this.convertFile()
		}
		return undefined
	}
	get isCurrentlyConverting(): boolean {
		return this.conversionQueueService.isCurrentlyConverting
	}
	set isCurrentlyConverting(isConverting: boolean) {
		this.conversionQueueService.isCurrentlyConverting = isConverting
	}
	get queueService(): ConversionQueueService {
		return this.conversionQueueService
	}
	get queueLength(): number {
		return this.conversionQueueService.conversionQueue.length
	}
}