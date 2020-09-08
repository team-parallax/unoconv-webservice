import { ConversionQueueService } from "./conversionQueue"
import {
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequest,
	IConversionRequestBody,
	IConversionStatusResponse
} from "./interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../logger"
import { UnoconvService } from "../unoconv"
import {
	deleteFile,
	writeToFile
} from "../file-io"
import { v4 as uuidV4 } from "uuid"
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
		} = this.queueService.addToConversionQueue(requestObject)
		// eslint-disable-next-line no-void
		void this.update()
		return {
			conversionId
		}
	}
	async convertFile(): Promise<void> {
		const fileToProcess = this.queueService.getNextQueueElement()
		if (fileToProcess) {
			const {
				conversionId,
				name,
				path,
				targetFormat
			} = fileToProcess
			this.queueService.isCurrentlyConverting = true
			this.queueService.currentlyConvertingFile = fileToProcess
			this.queueService.changeConvLogEntry(conversionId, "processing")
			try {
				const resp = await UnoconvService.convertToTarget({
					conversionId,
					filePath: path,
					outputFilename: name,
					targetFormat
				})
				await deleteFile(path)
				this.conversionQueueService.addToConvertedQueue(
					conversionId,
					resp
				)
				this.queueService.changeConvLogEntry(conversionId, "converted")
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
	public getConversionQueueStatus(): IConversionQueueStatus {
		return {
			conversions: this.queueService.conversionLog,
			remainingConversions: this.queueLength
		}
	}
	public getConvertedFile(fileId: string): IConversionStatusResponse {
		return this.queueService.getStatusById(fileId)
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
		return this.queueService.isCurrentlyConverting
	}
	set isCurrentlyConverting(isConverting: boolean) {
		this.queueService.isCurrentlyConverting = isConverting
	}
	get queueService(): ConversionQueueService {
		return this.conversionQueueService
	}
	get queueLength(): number {
		return this.queueService.conversionQueue.length
	}
}