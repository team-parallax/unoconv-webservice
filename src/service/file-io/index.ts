import { Logger } from "../logger"
import {
	existsSync, mkdir, writeFile
} from "fs"
type TArrayBufferView = NodeJS.ArrayBufferView
const logger: Logger = new Logger()
export const writeToFile = async (
	outputPath: string,
	data: TArrayBufferView
): Promise<string> => {
	return new Promise((resolve, reject) => {
		writeFile(outputPath, data, err => {
			reject(err)
		})
		resolve(`Created File in ${outputPath}.`)
	})
}
export const createDirectoryIfNotPresent = async (
	newDirectory: string
): Promise<string> => {
	return new Promise((resolve, reject) => {
		if (!existsSync(newDirectory)) {
			mkdir(
				newDirectory,
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					recursive: true
				},
				err => {
					reject(err)
				}
			)
			logger.log(`Directory '${newDirectory}' was successfully created.`)
			resolve("Created")
		}
		else {
			reject(`Dir '${newDirectory}' already exists.`)
		}
	})
}