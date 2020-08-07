import { IConversionRequestBody } from "~/model"
export class ConversionService {
	static convertFile(file: IConversionRequestBody): any {
		return {
			message: "Not yet implemented."
		}
	}
	static getConvertedFile(fileId: string): any {
		return {
			filename: "test.pdf"
		}
	}
}