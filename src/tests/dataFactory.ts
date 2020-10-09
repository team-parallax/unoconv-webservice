import { IConversionRequest, IConversionRequestBody } from "Service/conversion/interface"
import { v4 as uuid } from "uuid"
export const generateConversionRequests = (amount: number = 1): IConversionRequest[] => {
	const result: IConversionRequest[] = []
	let dataSets = amount
	while (dataSets > 0) {
		result.push({
			conversionId: uuid(),
			isConverted: false,
			name: `name${dataSets}`,
			path: `some/path/to/${dataSets}`,
			targetFormat: "pdf"
		})
		dataSets--
	}
	return result
}
export const generateConversionRequestBodies = (
	originalFormat: string,
	targetFormat: string,
	amount: number = 1
): IConversionRequestBody[] => {
	const result: IConversionRequestBody[] = []
	let dataSets = amount
	while (dataSets > 0) {
		result.push({
			file: Buffer.from(`testfilename${amount - dataSets + 1}`),
			filename: `testfilename${amount - dataSets + 1}`,
			originalFormat,
			targetFormat
		})
		dataSets--
	}
	return result
}