/* eslint-disable @typescript-eslint/prefer-readonly */
import {
	IConversionProcessingResponse,
	IConversionRequest,
	IConversionResult,
	IConversionStatusResponse
} from "./interface"
import { NoSuchConversionIdError } from "../../constants"
export class ConversionQueueService {
	private static instance: ConversionQueueService
	private conversion!: IConversionRequest[]
	private converted!: IConversionResult[]
	private currentlyConverting!: IConversionRequest | null
	private isConverting!: boolean
	constructor() {
		if (ConversionQueueService.instance) {
			return ConversionQueueService.instance
		}
		ConversionQueueService.instance = this
		this.conversion = []
		this.converted = []
		this.currentlyConverting = null
		this.isConverting = false
		return this
	}
	public addToConversionQueue(requestObject: IConversionRequest): IConversionProcessingResponse {
		this.conversion.push(requestObject)
		return {
			conversionId: requestObject.conversionId
		}
	}
	public addToConvertedQueue(
		requestObject: IConversionRequest,
		convertedPath: string
	): IConversionProcessingResponse {
		const {
			conversionId,
			name
		} = requestObject
		this.converted.push({
			conversionId,
			name,
			path: convertedPath
		})
		this.currentlyConvertingFile = null
		return {
			conversionId
		}
	}
	public getNextQueueElement(): IConversionRequest | undefined {
		return this.conversionQueue.shift()
	}
	public getStatusById(conversionId: string): IConversionStatusResponse {
		const response = (
			message: string,
			result?: IConversionResult
		): IConversionStatusResponse => ({
			message,
			result
		})
		const isInConversionQueue: boolean = this.isInQueue(conversionId, this.conversionQueue)
		const isInConvertedQueue: boolean = this.isInQueue(conversionId, this.convertedQueue)
		if (this.currentlyConvertingFile?.conversionId === conversionId) {
			return response("processing")
		}
		if (isInConversionQueue) {
			return response("in queue")
		}
		if (isInConvertedQueue) {
			const convertedFile = this.convertedQueue
				.filter(item => item.conversionId === conversionId)[0]
			return response("converted", convertedFile)
		}
		else {
			throw new NoSuchConversionIdError(`No conversion request found for given conversionId ${conversionId}`)
		}
	}
	isInQueue(
		conversionId: string,
		queue: IConversionRequest[] | IConversionResult[]
	): boolean {
		return queue.filter(item => item.conversionId === conversionId).length > 0
	}
	public removeFromConvertedQueue(removee: IConversionResult): void {
		this.convertedQueue.splice(this.convertedQueue.indexOf(removee), 1)
	}
	get conversionQueue(): IConversionRequest[] {
		return this.conversion
	}
	get convertedQueue(): IConversionResult[] {
		return this.converted
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