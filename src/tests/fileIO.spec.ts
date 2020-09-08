/* eslint-disable @typescript-eslint/naming-convention */
import {
	createDirectoryIfNotPresent,
	readFileToBuffer,
	writeToFile
} from "../service/file-io"
import {
	existsSync,
	rmdirSync
} from "fs"
describe("It should pass all tests for File-IO", () => {
	const inDirectory = "./testing/input"
	const outDirectory = "./testing/out"
	beforeAll(() => {
		if (existsSync(inDirectory)) {
			rmdirSync(inDirectory, {
				recursive: true
			})
		}
		if (existsSync(outDirectory)) {
			rmdirSync(outDirectory, {
				recursive: true
			})
		}
	})
	it("It should create a new directory named 'input'", async () => {
		/* Act */
		const createDir = createDirectoryIfNotPresent(inDirectory)
		/* Assert */
		await expect(createDir).resolves.toMatch("Created")
	})
	it("It should create a new directory named 'out'", async () => {
		/* Act */
		const createDir = createDirectoryIfNotPresent(outDirectory)
		/* Assert */
		await expect(createDir).resolves.toMatch("Created")
	})
	it("It should throw an error because directory 'src' already exists", async () => {
		/* Arrange */
		const directoryName = "src"
		/* Act */
		const createDir = createDirectoryIfNotPresent(directoryName)
		/* Assert */
		await expect(createDir).rejects.toMatch(`Dir '${directoryName}' already exists.`)
	})
	it("It should create a new file named 'test.txt'", async () => {
		/* Arrange */
		const filepath = "./testing/out/testfile.txt"
		const data = Buffer.from("Some example text to write to a file")
		/* Act */
		const createFile = writeToFile(filepath, data)
		/* Assert */
		await expect(createFile).resolves.toMatch(`Created File in ${filepath}.`)
	})
})
describe.skip("It should create new Buffers from files", () => {
	const txtFilePath = "./testing/out/testTxt.txt"
	const pdfFilePath = "./testing/out/testPdf.pdf"
	const testFileContent = "This is test content for the files to create"
	const buffer = Buffer.from(testFileContent)
	const outDirectory = "./testing/out"
	beforeAll(async done => {
		await createDirectoryIfNotPresent(outDirectory)
		await writeToFile(txtFilePath, buffer)
		await writeToFile(pdfFilePath, buffer)
		done()
	})
	it("It should read in a .txt file as Buffer", async () => {
		/* Act */
		const file = await readFileToBuffer(txtFilePath)
		/* Assert */
		expect(file).toMatchObject(buffer)
	})
	it("It should read in a .pdf file as Buffer", async () => {
		/* Act */
		const file = await readFileToBuffer(pdfFilePath)
		/* Assert */
		expect(file).toMatchObject(buffer)
	})
})