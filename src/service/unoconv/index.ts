// eslint-disable-next-line spaced-comment
/// <reference path="./index.d.ts"/>
import {
	ConversionError,
	NoPathForConversionError,
	NoTargetFormatSpecifiedError
} from "../../constants"
import {
	IConversionParams,
	IConvertedFile,
	IFormatList
} from "./interface"
import { writeToFile } from "../file-io"
import unoconv from "unoconv2"
type TErrnoException = NodeJS.ErrnoException
export class UnoconvService {
	public static async convertToTarget(
		{
			conversionId,
			filePath,
			outputFilename,
			targetFormat
		}: IConversionParams
	): Promise<IConvertedFile> {
		let filename: string = `${outputFilename}-converted`
		// TODO: save file as <conversionId>.<EXT>
		if (!outputFilename?.length) {
			// If no output filename is provided the output will be named with after scheme below:
			// <OLD-NAME>-converted.<EXT>
			filename = conversionId
		}
		if (!filePath?.length) {
			throw new NoPathForConversionError("No Path for file to convert provided.")
		}
		if (!targetFormat?.length) {
			throw new NoTargetFormatSpecifiedError("No target format specified.")
		}
		// Todo: add errors for invalid conversion arguments, such as wrong targetformat etc.
		try {
			return new Promise((resolve, reject) => {
				unoconv.convert(
					filePath,
					targetFormat,
					async (
						err: TErrnoException,
						res: Buffer
					) => {
						if (err) {
							reject(err)
						}
						try {
							const path = `./out/${conversionId}.${targetFormat}`
							await writeToFile(path, res)
							const result: IConvertedFile = {
								outputFilename: `${filename}.${targetFormat}`,
								path,
								resultFile: res
							}
							resolve(result)
						}
						catch (err) {
							reject(err)
						}
					}
				)
			})
		}
		catch (err) {
			throw new ConversionError(err)
		}
	}
	public static async showAvailableFormats(): Promise<IFormatList> {
		return new Promise((resolve, reject) => {
			unoconv.detectSupportedFormats((err: TErrnoException, res: IFormatList) => {
				if (err) {
					reject(err)
				}
				resolve(res)
			})
		})
	}
}