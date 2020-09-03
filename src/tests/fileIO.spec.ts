import {
	createDirectoryIfNotPresent,
	writeToFile
} from "../service/file-io"
describe("It should pass all tests for File-IO", () => {
	it("It should create a new directory named 'input'", async () => {
		/* Arrange */
		const directoryName = "./test/input"
		/* Act */
		const createDir = createDirectoryIfNotPresent(directoryName)
		// CCreateDir("input")
		/* Assert */
		await expect(createDir).resolves.toMatch("Created")
	})
	it("It should throw an error because directory 'src' already exists", async () => {
		/* Arrange */
		const directoryName = "src"
		/* Act */
		const createDir = createDirectoryIfNotPresent(directoryName)
		// CCreateDir("input")
		/* Assert */
		await expect(createDir).rejects.toMatch(`Dir '${directoryName}' already exists.`)
	})
	it("It should create a new file named 'test.txt'", async () => {
		/* Arrange */
		const filepath = "./out/testfile.txt"
		const data = Buffer.from("Some example text to write to a file")
		/* Act */
		const createFile = writeToFile(filepath, data)
		/* Assert */
		await expect(createFile).resolves.toMatch(`Created File in ${filepath}.`)
	})
})