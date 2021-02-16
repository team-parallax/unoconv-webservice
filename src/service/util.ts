import {
	CBasePath,
	CMaxAllowedConversionFailuresFallback,
	CMaxAllowedConversionTimeFallback,
	CommandNotFoundError,
	ConfigurationValueError,
	EMaxValue
} from "../constants"
import { config } from "dotenv"
import { exec } from "child_process"
import { resolve } from "path"
config()
export const executeShellCommand = async (command: string): Promise<string> => {
	return await new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				if (error.message.includes("not found")) {
					reject(new CommandNotFoundError("Command could not be found."))
				}
				reject(error)
			}
			else if (stderr) {
				reject(stderr)
			}
			resolve(stdout)
		})
	})
}
export const getMaxAllowedConversionValues = (value: EMaxValue): number => {
	const maxValueString = process.env[value]
	const maxValue = Number(maxValueString)
	// Happens if maxValueString is undefined
	if (isNaN(maxValue)) {
		switch (value) {
			case EMaxValue.conversionTime:
				return CMaxAllowedConversionTimeFallback
			case EMaxValue.failures:
				return CMaxAllowedConversionFailuresFallback
			default:
				throw new ConfigurationValueError(`Unknown error with input: ${value}`)
		}
	}
	else {
		return maxValue
	}
}
export const resolvePath = (pathParam: string): string => {
	return resolve(CBasePath, pathParam)
}