import { CMaxAllowedConversionFailures } from "~/constants"
import { ConversionQueueService } from "./conversionQueue"
import { EConversionStatus } from "./enum"
import {
	IConversionInQueue,
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequest,
	IConversionRequestBody,
	IConversionStatus
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
		this.logger.log(`Add ${conversionId} to conversion queue.`)
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
			this.logger.log(`Starting conversion process for conversionId: ${conversionId}`)
			this.queueService.isCurrentlyConverting = true
			this.queueService.currentlyConvertingFile = fileToProcess
			this.queueService.changeConvLogEntry(conversionId, EConversionStatus.processing)
			try {
				this.logger.log(`Starting unoconv conversion for ${conversionId}`)
				this.logger.log(`Converting ${path} --> ${name}.${targetFormat}`)
				const resp = await UnoconvService.convertToTarget({
					conversionId,
					filePath: path,
					outputFilename: name,
					targetFormat
				})
				// Delete the input file
				this.logger.log(`[ConversionQueue] delete input file for ${conversionId}`)
				await deleteFile(path)
				this.logger.log(`[ConversionQueue] add ${conversionId} to converted queue`)
				this.queueService.addToConvertedQueue(
					conversionId,
					resp
				)
				this.logger.log(`[ConversionQueue] added to ${conversionId} to converted-queue`)
			}
			catch (err) {
				this.logger.error(`[CRITICAL] An unkown error occured during the conversion of ${path} (${conversionId}). Output from unoconv:`)
				this.logger.error(`${err.name} ${err.message}`)
				const failures: number = this.queueService.getConversionFailureAttempts(
					conversionId
				)
				const remainingConversionTries = CMaxAllowedConversionFailures - failures
				if (remainingConversionTries === 0) {
					this.logger.error("Maximum conversion tries exceeded. Removing item.")
					this.queueService.changeConvLogEntry(
						conversionId,
						EConversionStatus.failed,
						name,
						path,
						targetFormat
					)
					await deleteFile(path)
				}
				else {
					this.logger.error(
						`Conversion process for id: ${conversionId} timed out. Remaining Tries: ${remainingConversionTries}`
					)
					this.queueService.changeConvLogEntry(
						conversionId,
						EConversionStatus.erroneous,
						name,
						path,
						targetFormat
					)
				}
			}
			finally {
				this.isCurrentlyConverting = false
				// eslint-disable-next-line no-void
				void this.update()
			}
		}
	}
	public getConversionQueueStatus(): IConversionQueueStatus {
		const conversions: IConversionInQueue[] = []
		for (const [key, value] of this.queueService.conversionLog) {
			const queuePosition: number = this.queueService.conversionQueue.findIndex(
				element => element.conversionId === key
			)
			if (value.status === EConversionStatus.inQueue) {
				conversions.push({
					...value,
					conversionId: key,
					queuePosition
				})
			}
		}
		return {
			conversions,
			remainingConversions: this.queueLength
		}
	}
	public getConversionStatus(fileId: string): IConversionStatus {
		this.logger.log(`Get conversion status of ${fileId}`)
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