/* eslint-disable no-console */
export class Logger {
	private readonly prettyfyingSpaces = 2
	error = (content: unknown): void => {
		console.error(JSON.stringify(content, null, this.prettyfyingSpaces))
	}
	log = (content: unknown): void => {
		console.log(JSON.stringify(content, null, this.prettyfyingSpaces))
	}
}