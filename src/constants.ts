import { getMaxAllowedConversionValues } from "./service/util"
import { join, resolve } from "path"
export enum EMaxValue {
	conversionTime = "MAX_CONVERSION_TIME",
	failures = "MAX_CONVERSION_RETRIES"
}
export enum EHttpResponseCodes {
	ok = 200,
	created = 201,
	noContent = 204,
	badRequest = 400,
	unauthorized = 401,
	forbidden = 403,
	notFound = 404,
	internalServerError = 500,
	unavailable = 503
}
export const CBasePath: string = resolve(join(__dirname, "../"))
export const CMaxAllowedConversionTimeFallback: number = 120000
export const CMaxAllowedConversionTime: number = getMaxAllowedConversionValues(
	EMaxValue.conversionTime
)
export const CMaxAllowedConversionFailuresFallback: number = 5
export const CMaxAllowedConversionFailures: number = getMaxAllowedConversionValues(
	EMaxValue.failures
)
export class CommandNotFoundError extends Error {
	readonly name: string
	constructor(message: string) {
		super(message)
		this.name = "CommandNotFoundError"
	}
}
export class ConversionError extends Error {
	readonly name: string
	constructor(message: string) {
		super(message)
		this.name = "ConversionError"
	}
}
export class ConversionTimeoutError extends ConversionError {
	readonly conversionProcessId: number
	readonly name: string
	constructor(message: string, convPid?: number) {
		super(message)
		this.name = "ConversionTimeoutError"
		this.conversionProcessId = convPid ?? -1
	}
}
export class InvalidPathError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "InvalidPathError"
	}
}
export class ConfigurationValueError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "MissingConfigurationValueError"
	}
}
export class NoPathForConversionError extends InvalidPathError {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "NoPathForConversionError"
	}
}
export class NoSuchConversionIdError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "NoSuchConversionIdError"
	}
}
export class NoTargetFormatSpecifiedError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "NoTargetFormatSpecifiedError"
	}
}