export interface IFileFormat {
	description: string,
	extension: string,
	format: string,
	mime: string
}
export interface IFormatList {
	document: IFileFormat[],
	presentation: IFileFormat[],
	spreadsheet: IFileFormat[]
}
export interface IConvertedFile {
	outputFilename: string,
	path: string
}
export interface IConversionParams {
	conversionId: string,
	filePath: string,
	outputFilename?: string,
	targetFormat: string
}