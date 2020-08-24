/* eslint-disable no-await-in-loop */
import { UnoconvService } from "../service/unoconv"
describe("Service should pass all tests", () => {
	describe("it should throw errors because of invalid parameters", () => {
		it("should throw an error because of no file path present", async () => {
			/* Arrange */
			const filePath = ""
			const filename = "test"
			const targetFormat = "pdf"
			/* Act */
			const conversionTry = UnoconvService
				.convertToTarget
				.bind(null, {
					filePath,
					outputFilename: filename,
					targetFormat
				})
			/* Assert */
			return await expect(conversionTry).rejects.toThrow("No Path for file to convert provided.")
		})
		it("should throw an error because no parameter values are present", async () => {
			/* Arrange */
			const filePath = ""
			const filename = "test"
			const targetFormat = "pdf"
			/* Act */
			const conversionTry = UnoconvService
				.convertToTarget
				.bind(null, {
					filePath,
					outputFilename: filename,
					targetFormat
				})
			/* Assert */
			return await expect(conversionTry).rejects.toThrow("No Path for file to convert provided.")
		})
		it("should throw an error because no target format to convert is present", async () => {
			/* Arrange */
			const filePath = "./sample-input/test.txt"
			const filename = ""
			const targetFormat = ""
			/* Act */
			const conversionTry = UnoconvService
				.convertToTarget
				.bind(null, {
					filePath,
					outputFilename: filename,
					targetFormat
				})
			/* Assert */
			return await expect(conversionTry).rejects.toThrow("No target format specified.")
		})
	})
	describe("it should convert files from various text-file formats to pdf", () => {
		it("it should convert .txt to .pdf", async () => {
			/* Assign */
			const filePath = "./sample-input/sample.txt"
			const filename = "TXTSample"
			const targetFormat = "pdf"
			/* Act */
			const convertedFile = await UnoconvService.convertToTarget({
				filePath,
				outputFilename: filename,
				targetFormat
			})
			const {
				path: convertedFilePath
			} = convertedFile
			/* Assert */
			expect(convertedFile).toHaveProperty("path")
			expect(convertedFilePath).toMatch(/(\.\/out\/[A-Za-z0-9]+(-converted)\.pdf)/)
		})
		// TODO: fix this test case to also run in pipeline
		// It("it should convert multiple .txts to .pdfs", async () => {
		// 	// Sometimes the test does not pass at first try which is related to the following
		// 	// Issue: https://github.com/unoconv/unoconv/issues/85
		// 	// Re-run the tests and it should work
		// 	Const datasetSize = 2
		// 	Const converterPromises: Promise<IConvertedFile>[] = []
		// 	For (let i = 1; i <= datasetSize; i++) {
		// 		/* Assign */
		// 		Const filePath = "./sample-input/sample.txt"
		// 		Const filename = `TXTSampleConcurrent${i}`
		// 		Const targetFormat = "pdf"
		// 		/* Act */
		// 		Const convertedFile: Promise<IConvertedFile> = UnoconvService.convertToTarget({
		// 			FilePath,
		// 			OutputFilename: filename,
		// 			TargetFormat
		// 		})
		// 		ConverterPromises.push(convertedFile)
		// 	}
		// 	Const convertedFiles: IConvertedFile[] = await Promise.all(converterPromises)
		// 	For (const convertedFile of convertedFiles) {
		// 		Const {
		// 			Path: convertedFilePath
		// 		} = convertedFile
		// 		/* Assert */
		// 		Expect(convertedFile).toHaveProperty("path")
		// 		Expect(convertedFilePath).toMatch(/(\.\/out\/[A-Za-z0-9]+(-converted)\.pdf)/)
		// 	}
		// // eslint-disable-next-line @typescript-eslint/no-magic-numbers
		// }, 30000)
		it("it should convert .rtf to .pdf", async () => {
			/* Assign */
			const filePath = "./sample-input/sample.rtf"
			const filename = "RTFSample"
			const targetFormat = "pdf"
			/* Act */
			const convertedFile = await UnoconvService.convertToTarget({
				filePath,
				outputFilename: filename,
				targetFormat
			})
			const {
				path: convertedFilePath
			} = convertedFile
			/* Assert */
			expect(convertedFile).toHaveProperty("path")
			expect(convertedFilePath).toMatch(/(\.\/out\/[A-Za-z0-9]+(-converted)\.pdf)/)
		})
	})
	describe("it should convert files from different media formats to pdf", () => {
		it("it should convert .png to .pdf", async () => {
			/* Assign */
			const filePath = "./sample-input/sample.png"
			const filename = "PNGSample"
			const targetFormat = "pdf"
			/* Act */
			const convertedFile = await UnoconvService.convertToTarget({
				filePath,
				outputFilename: filename,
				targetFormat
			})
			const {
				path: convertedFilePath
			} = convertedFile
			/* Assert */
			expect(convertedFile).toHaveProperty("path")
			expect(convertedFilePath).toMatch(/(\.\/out\/[A-Za-z0-9]+(-converted)\.pdf)/)
		})
	})
	it("should return a list with all supported formats", async () => {
		/* Assign */
		const availableFormats = await UnoconvService.showAvailableFormats()
		/* Act */
		/* Assert */
		expect(availableFormats).toBeDefined()
	})
})