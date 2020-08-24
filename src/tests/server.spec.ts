import { Api } from "../service/api"
describe("Server should pass all tests", () => {
	describe("All properties are assigned and have correct values: ", () => {
		it("should have initialized properties: ", () => {
			/* Arrange */
			const defaultPort: number = 3000
			/* Act */
			const server = new Api()
			const {
				port
			} = server
			/* Assert */
			expect(server).toBeInstanceOf(Api)
			expect(port).not.toBe(undefined)
			expect(port).toBe(defaultPort)
		})
	})
	describe("Port is assigned to correct value: ", () => {
		it("should have port 1337", () => {
			/* Arrange */
			const port: number = 1337
			/* Act */
			const server = new Api(port)
			/* Assert */
			expect(server.port).toBe(port)
		})
		it("should have port 2222", () => {
			/* Arrange */
			const port: number = 2222
			/* Act */
			const server = new Api(port)
			/* Assert */
			expect(server.port).toBe(port)
		})
		it("should have port the default port: 3000", () => {
			/* Arrange */
			const defaultPort: number = 3000
			/* Act */
			const server = new Api()
			/* Assert */
			expect(server.port).toBe(defaultPort)
		})
	})
})