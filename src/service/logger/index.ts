export class Logger {
	error = (content: unknown): void => {
		console.error(JSON.stringify(content, null, 2))
	}
	log = (content: unknown): void => {
		console.log(JSON.stringify(content, null, 2))
	}
}