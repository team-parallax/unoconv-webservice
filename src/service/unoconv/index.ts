// eslint-disable-next-line spaced-comment
/// <reference path="./index.d.ts"/>
import * as fs from "fs"
import {
	IConversionParams,
	IConvertedFile,
	IFormatList
} from "./interface"
import unoconv from "unoconv2"
type TErrnoException = NodeJS.ErrnoException
type TArrayBufferView = NodeJS.ArrayBufferView
export class UnoconvService {
	public static async convertToTarget(
		{
			filePath,
			outputFilename,
			targetFormat
		}: IConversionParams
	): Promise<IConvertedFile> {
		let filename: string = `${outputFilename}-converted`
		if (!outputFilename?.length) {
			// If no output filename is specified the output will be named with after scheme below:
			// <OLD-NAME>-converted.<EXT>
			filename = filePath
		}
		if (!filePath?.length) {
			throw Error("No Path for file to convert provided.")
		}
		if (!targetFormat?.length) {
			throw Error("No target format specified.")
		}
		return new Promise((resolve, reject) => {
			unoconv.convert(
				filePath,
				targetFormat,
				async (
					err: TErrnoException,
					res: TArrayBufferView
				) => {
					if (err) {
						reject(err)
					}
					try {
						const path = `./out/${filename}.pdf`
						await UnoconvService.writeToOutputFile(path, res)
						const result: IConvertedFile = {
							path
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
	private static async writeToOutputFile(
		outputPath: string,
		data: TArrayBufferView
	): Promise<TArrayBufferView> {
		return new Promise((resolve, reject) => {
			fs.writeFile(outputPath, data, err => {
				reject(err)
			})
			resolve(data)
		})
	}
}