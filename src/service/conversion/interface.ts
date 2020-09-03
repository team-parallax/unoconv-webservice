export interface IConversionRequestBody {
	file: Buffer,
	filename: string,
	originalFormat: string,
	targetFormat: string
}
export interface IConversionProcessingResponse {
	conversionId: string
}
export interface IConversionRequest {
	conversionId: string,
	isConverted: boolean,
	name: string,
	path: string,
	targetFormat: string
}
export interface IConversionStatusResponse {
	message: string,
	result?: IConversionResult
}
export interface IConversionResult {
	conversionId: string,
	name: string,
	path: string
}