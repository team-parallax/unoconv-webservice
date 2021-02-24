import { EConversionStatus } from "./enum"
import {
	IConversionFinished,
	IConversionInProgress,
	IConversionInQueue,
	IConversionProcessingResponse,
	IConversionRequest,
	IConversionResult,
	IConversionStatus
} from "./interface"
import { IConvertedFile } from "../unoconv/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../logger"
import { NoSuchConversionIdError } from "../../constants"
import { readFromFileSync } from "../file-io"
export class ConversionQueueService {
	private static instance: ConversionQueueService
	@Inject
	private readonly logger!: Logger
	private convLog!: Map<string, Omit<IConversionStatus, "conversionId">>
	private conversion!: IConversionRequest[]
	private converted!: IConversionResult[]
	private currentlyConverting!: IConversionRequest | null
	private isConverting!: boolean
	constructor() {
		if (ConversionQueueService.instance) {
			return ConversionQueueService.instance
		}
		ConversionQueueService.instance = this
		this.convLog = new Map<string, Omit<IConversionStatus, "conversionId">>()
		this.conversion = []
		this.converted = []
		this.currentlyConverting = null
		this.isConverting = false
		return this
	}
	public addToConversionQueue(
		requestObject: IConversionRequest,
		failures: number = 0
	): IConversionProcessingResponse {
		this.conversion.push(requestObject)
		this.convLog.set(requestObject.conversionId, {
			failures,
			status: EConversionStatus.inQueue
		})
		return {
			conversionId: requestObject.conversionId
		}
	}
	public addToConvertedQueue(
		conversionId: string,
		conversionResult: IConvertedFile
	): IConversionProcessingResponse {
		const {
			outputFilename,
			path
		} = conversionResult
		this.converted.push({
			conversionId,
			name: outputFilename,
			path
		})
		this.currentlyConvertingFile = null
		this.changeConvLogEntry(conversionId, EConversionStatus.converted)
		return {
			conversionId
		}
	}
	public changeConvLogEntry(
		conversionId: string,
		status: EConversionStatus,
		filename?: string,
		inputPath?: string,
		targetFormat?: string
	): void {
		const element = this.convLog.get(conversionId)
		const failureCounter = this.getConversionFailureAttempts(conversionId)
		if (!element) {
			throw new NoSuchConversionIdError("No such conversion element")
		}
		else {
			switch (status) {
				case EConversionStatus.erroneous: {
					this.addToConversionQueue(
						{
							conversionId,
							name: filename ?? conversionId,
							path: inputPath ?? "",
							targetFormat: targetFormat ?? "pdf"
						},
						failureCounter + 1
					)
					break
				}
				default:
					element.status = status
			}
		}
	}
	public getConversionFailureAttempts(conversionId: string): number {
		const failures = this.convLog.get(conversionId)?.failures
		if (failures === undefined) {
			throw new NoSuchConversionIdError("No such conversionId")
		}
		this.logger.log(`Retrieving conversion failure attempts of ${conversionId}: ${failures}`)
		return failures
	}
	public getConversionQueuePosition(conversionId: string): number {
		return this.conversionQueue.findIndex(
			item => item.conversionId === conversionId
		) + 1
	}
	public getNextQueueElement(): IConversionRequest | undefined {
		return this.conversionQueue.shift()
	}
	public getStatusById(conversionId: string): IConversionStatus {
		const isFailedConversion = this.convLog.get(
			conversionId
		)?.status === EConversionStatus.failed
		const isErroneousDocument = this.convLog.get(
			conversionId
		)?.status === EConversionStatus.erroneous
		const isInConversionQueue: boolean = this.convLog.get(
			conversionId
		)?.status === EConversionStatus.inQueue
		const isInConvertedQueue: boolean = this.convLog.get(
			conversionId
		)?.status === EConversionStatus.converted
		if (isErroneousDocument) {
			this.logger.log(`Got erroneous document, removing ${conversionId}`)
			return this.response(EConversionStatus.erroneous, conversionId)
		}
		if (isFailedConversion) {
			return this.response(EConversionStatus.failed, conversionId)
		}
		if (this.currentlyConvertingFile?.conversionId === conversionId) {
			return this.response(EConversionStatus.processing, conversionId)
		}
		if (isInConversionQueue) {
			this.logger.log(`[Conversion Queue] creating in-queue response for ${conversionId}`)
			return this.response(EConversionStatus.inQueue, conversionId)
		}
		if (isInConvertedQueue) {
			this.logger.log(`[Conversion Queue] creating converted response for ${conversionId}`)
			return this.response(EConversionStatus.converted, conversionId)
		}
		else {
			throw new NoSuchConversionIdError(`No conversion request found for given conversionId ${conversionId}`)
		}
	}
	public removeFromConvertedQueue(removee: IConversionResult): void {
		this.convertedQueue.splice(this.convertedQueue.indexOf(removee), 1)
	}
	private response(
		status: EConversionStatus,
		conversionId: string
	): IConversionStatus {
		const failures = this.getConversionFailureAttempts(conversionId)
		const baseResp: IConversionInProgress = {
			conversionId,
			failures,
			status
		}
		switch (status) {
			case EConversionStatus.converted: {
				const convertedFile = this.convertedQueue
					.filter(item => item.conversionId === conversionId)[0]
				this.logger.log(`Got the converted file for ID: ${convertedFile.conversionId}`)
				const resultFile = readFromFileSync(convertedFile.path)
				const response: IConversionFinished = {
					...baseResp,
					resultFile
				}
				return response
			}
			case EConversionStatus.erroneous: {
				this.logger.log(`Send ERROR feedback for conversion ${conversionId} to client`)
				const newFailureCounter = this.getConversionFailureAttempts(conversionId) + 1
				return {
					...baseResp,
					failures: newFailureCounter
				}
			}
			case EConversionStatus.failed: {
				this.logger.log(`Send FAILURE feedback for conversion ${conversionId} to client`)
				this.logger.log(baseResp)
				return baseResp
			}
			case EConversionStatus.inQueue: {
				// Add one to have 1-indexed queue
				const queuePosition: number = this.getConversionQueuePosition(conversionId)
				const response: IConversionInQueue = {
					...baseResp,
					queuePosition
				}
				return response
			}
			default:
				return baseResp
		}
	}
	get conversionLog(): Map<string, Omit<IConversionStatus, "conversionId">> {
		return this.convLog
	}
	set conversionLog(newConvLog: Map<string, Omit<IConversionStatus, "conversionId">>) {
		this.convLog = newConvLog
	}
	get conversionQueue(): IConversionRequest[] {
		return this.conversion
	}
	set conversionQueue(newConversionQueue: IConversionRequest[]) {
		this.conversion = newConversionQueue
	}
	get convertedQueue(): IConversionResult[] {
		return this.converted
	}
	set convertedQueue(newConvertedQueue: IConversionResult[]) {
		this.converted = newConvertedQueue
	}
	get currentlyConvertingFile(): IConversionRequest | null {
		return this.currentlyConverting
	}
	set currentlyConvertingFile(file: IConversionRequest | null) {
		this.currentlyConverting = file
	}
	get isCurrentlyConverting(): boolean {
		return this.isConverting
	}
	set isCurrentlyConverting(isNewConvertingVal: boolean) {
		this.isConverting = isNewConvertingVal
	}
}