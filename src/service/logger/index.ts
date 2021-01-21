export class Logger {
	private readonly logSpaces = 2
	error = (content: unknown): void => {
		console.error(JSON.stringify(content, null, this.logSpaces))
	}
	log = (content: unknown): void => {
		console.log(JSON.stringify(content, null, this.logSpaces))
	}
}