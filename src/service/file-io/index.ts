import { InvalidPathError } from "~/constants"
import {
	existsSync,
	mkdir,
	readFileSync,
	readdirSync,
	rmdirSync,
	statSync,
	unlink,
	unlinkSync,
	writeFile
} from "fs"
import { resolvePath } from "../util"
export const createDirectoryIfNotPresent = async (
	newDirectory: string
): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!newDirectory.length) {
			reject(new InvalidPathError(`Invalid name for directory: ${newDirectory}`))
		}
		else if (!existsSync(newDirectory)) {
			mkdir(
				newDirectory,
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					recursive: true
				},
				err => {
					if (err) {
						reject(err)
					}
				}
			)
			resolve()
		}
		else {
			reject(`Dir '${newDirectory}' already exists.`)
		}
	})
}
export const deleteFile = async (path?: string): Promise<void> => {
	return await new Promise((resolve, reject) => {
		if (!path) {
			reject(new InvalidPathError("No path was provided"))
		}
		else if (!existsSync(path)) {
			reject(new InvalidPathError(`Given Path does not exist: ${path}`))
		}
		else {
			unlink(path, err => {
				if (err) {
					reject(err)
				}
			})
			resolve()
		}
	})
}
export const deleteFolderRecursive = (path: string): void => {
	if (isDirectory(path)) {
		readdirSync(path).forEach((file: string, index: number) => {
			const currentPath = `${path}/${file}`
			if (isDirectory(currentPath)) {
				deleteFolderRecursive(currentPath)
			}
			else {
				unlinkSync(currentPath)
			}
		})
		rmdirSync(path, {
			// eslint-disable-next-line @typescript-eslint/naming-convention
			recursive: true
		})
	}
	else {
		throw new InvalidPathError(`Given Path does not point to a directory: ${path}`)
	}
}
export const isFile = (path: string): boolean => {
	if (existsSync(path) && statSync(path).isFile()) {
		return true
	}
	return false
}
export const isDirectory = (path: string): boolean => {
	if (existsSync(path) && statSync(path).isDirectory()) {
		return true
	}
	return false
}
export const readFromFileSync = (pathParam: string): Buffer => {
	// Will evaluate to something like unoconv-webservice/<pathParam>
	const path = resolvePath(pathParam)
	if (!isFile(path)) {
		throw new InvalidPathError("No such file")
	}
	const file = readFileSync(path, {
		encoding: "utf8"
	})
	return Buffer.from(file)
}
export const writeToFile = async (
	outputPath: string,
	data: Buffer,
	isBinaryData: boolean = false
): Promise<void> => {
	const path = resolvePath(outputPath)
	return new Promise((resolve, reject) => {
		if (isBinaryData) {
			writeFile(path, data, "binary", err => {
				if (err) {
					reject(err)
				}
			})
		}
		else {
			writeFile(path, data, err => {
				if (err) {
					reject(err)
				}
			})
		}
		resolve()
	})
}