import {
	IConversionProcessingResponse,
	IConversionRequest,
	IConversionRequestBody,
	IConversionResult,
	IConversionStatusResponse
} from "./interface"
import { UnoconvService } from "../unoconv"
import { v4 as uuidV4 } from "uuid"
export class ConverterService {
	private readonly convertedFilesQueue: IConversionResult[]
	private currentlyConvertingFile: IConversionRequest | null
	private isConverting: boolean
	private readonly requestQueue: IConversionRequest[]
	constructor() {
		this.isConverting = false
		this.requestQueue = []
		this.convertedFilesQueue = []
		this.currentlyConvertingFile = null
	}
	get convertedFiles(): IConversionResult[] {
		return this.convertedFilesQueue
	}
	get currentlyConverting(): IConversionRequest | null {
		return this.currentlyConvertingFile
	}
	get conversionQueue(): IConversionRequest[] {
		return this.requestQueue
	}
	get isCurrentlyConverting(): boolean {
		return this.isConverting
	}
	get queueLength(): number {
		return this.requestQueue.length
	}
	set currentlyConverting(file: IConversionRequest | null) {
		this.currentlyConvertingFile = file
	}
	set isCurrentlyConverting(isConverting: boolean) {
		this.isConverting = isConverting
	}
	public addToConversionQueue(requestObject: IConversionRequest): IConversionProcessingResponse {
		this.requestQueue.push(requestObject)
		// eslint-disable-next-line no-void
		void this.update()
		return {
			conversionId: requestObject.conversionId
		}
	}
	async convertFile(): Promise<unknown> {
		const fileToProcess = this.getNextQueueElement()
		if (fileToProcess) {
			this.isCurrentlyConverting = true
			this.currentlyConverting = fileToProcess
			const resp = await UnoconvService.convertToTarget({
				filePath: fileToProcess.path,
				outputFilename: fileToProcess.name,
				targetFormat: fileToProcess.targetFormat
			})
			this.isCurrentlyConverting = false
			return this.addToConvertedQueue(
				fileToProcess,
				resp.path
			)
		}
		return undefined
	}
	public getConvertedFile(fileId: string): IConversionStatusResponse {
		const conversionQueue = this.conversionQueue.filter(
			request => request.conversionId === fileId
		)
		const convertedFiles = this.convertedFiles.filter(result => result.conversionId === fileId)
		const response = (
			message: string,
			result?: IConversionResult
		): IConversionStatusResponse => ({
			message,
			result
		})
		if (this.currentlyConverting?.conversionId === fileId) {
			return response("processing")
		}
		if (conversionQueue) {
			return response("in Queue")
		}
		if (convertedFiles) {
			const requestedFile = convertedFiles[0]
			return response("converted", requestedFile)
		}
		throw Error(`No conversion request found for id: ${fileId}`)
	}
	public processConversionRequest({
		filename,
		originalFormat,
		targetFormat
	}: IConversionRequestBody): IConversionProcessingResponse {
		const conversionId = uuidV4()
		const request: IConversionRequest = {
			conversionId,
			isConverted: false,
			name: filename,
			path: `./sample-input/sample.${originalFormat}`,
			targetFormat
		}
		return this.addToConversionQueue(request)
	}
	private addToConvertedQueue(queueObject: IConversionRequest, convertedPath: string): void {
		const {
			conversionId,
			name
		} = queueObject
		this.convertedFilesQueue.push({
			conversionId,
			name,
			path: convertedPath
		})
		// eslint-disable-next-line no-void
		void this.update()
	}
	private getNextQueueElement(): IConversionRequest | undefined {
		return this.requestQueue.shift()
	}
	private async update(): Promise<void> {
		if (this.isCurrentlyConverting) {
			return
		}
		else {
			await this.convertFile()
		}
	}
}