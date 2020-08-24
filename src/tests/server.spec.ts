import { Server } from "../server"
describe("Server should pass all tests", () => {
	describe("All properties are assigned and have correct values: ", () => {
		it("should have initialized properties: ", () => {
			/* Arrange */
			const defaultPort: number = 3000
			const server = new Server()
			/* Act */
			const {
				port
			} = server
			/* Assert */
			expect(server).toBeInstanceOf(Server)
			expect(port).not.toBe(undefined)
			expect(port).toBe(defaultPort)
		})
	})
	describe("Port is assigned to correct value: ", () => {
		it("should have port 1337", () => {
			/* Arrange */
			const port: number = 1337
			/* Act */
			const server = new Server(port)
			/* Assert */
			expect(server.port).toBe(port)
		})
		it("should have port 2222", () => {
			/* Arrange */
			const port: number = 2222
			/* Act */
			const server = new Server(port)
			/* Assert */
			expect(server.port).toBe(port)
		})
		it("should have port the default port: 3000", () => {
			/* Arrange */
			const defaultPort: number = 3000
			/* Act */
			const server = new Server()
			/* Assert */
			expect(server.port).toBe(defaultPort)
		})
	})
})