export class Logger {
	error = (content: string): void => {
		console.error(content)
	}
	log = (content: string): void => {
		console.log(content)
	}
}