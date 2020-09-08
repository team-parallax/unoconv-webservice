import {
	createReadStream,
	existsSync,
	mkdir,
	unlink,
	writeFile
} from "fs"
type TArrayBufferView = NodeJS.ArrayBufferView
export const deleteFile = async (path: string | undefined): Promise<void> => {
	return await new Promise((resolve, reject) => {
		if (!path) {
			reject()
		}
		else {
			unlink(path, err => {
				reject(err)
			})
			resolve()
		}
	})
}
export const readFileToBuffer = async (path: string): Promise<Buffer> => {
	const stream = createReadStream(path)
	const data: Buffer[] = []
	return await new Promise((resolve, reject) => {
		stream.on("data", (chunk: string | Buffer) => {
			if (typeof chunk === "string") {
				data.push(Buffer.from(chunk))
			}
			else {
				data.push(chunk)
			}
		})
		stream.on("error", (error: Error) => {
			reject(error)
		})
		stream.on("end", () => {
			resolve(Buffer.concat(data))
		})
	})
}
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
			resolve("Created")
		}
		else {
			reject(`Dir '${newDirectory}' already exists.`)
		}
	})
}