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
export class ConversionError extends Error {
	readonly name: string
	constructor(message: string) {
		super(message)
		this.name = "ConversionError"
	}
}
export class NoTargetFormatSpecifiedError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "NoTargetFormatSpecifiedError"
	}
}
export class NoPathForConversionError extends Error {
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