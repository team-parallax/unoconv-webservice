import {
	NoPathForConversionError,
	NoTargetFormatSpecifiedError
} from "../constants"
import { UnoconvService } from "../service/unoconv"
import { v4 as uuid } from "uuid"
describe("Service should pass all tests", () => {
	describe("It should throw errors because of invalid parameters", () => {
		it("should throw an error because of no file path present", async () => {
			/* Arrange */
			const filePath = ""
			const filename = "test"
			const targetFormat = "pdf"
			const conversionId = uuid()
			/* Act */
			const conversionTry = UnoconvService
				.convertToTarget
				.bind(null, {
					conversionId,
					filePath,
					outputFilename: filename,
					targetFormat
				})
			/* Assert */
			await expect(conversionTry).rejects.toThrow(NoPathForConversionError)
		})
		it("should throw an error because no parameter values are present", async () => {
			/* Arrange */
			const filePath = ""
			const filename = "test"
			const targetFormat = "pdf"
			const conversionId = uuid()
			/* Act */
			const conversionTry = UnoconvService
				.convertToTarget
				.bind(null, {
					conversionId,
					filePath,
					outputFilename: filename,
					targetFormat
				})
			/* Assert */
			await expect(conversionTry).rejects.toThrow(NoPathForConversionError)
		})
		it("should throw an error because no target format to convert is present", async () => {
			/* Arrange */
			const filePath = "./sample-input/test.txt"
			const filename = ""
			const targetFormat = ""
			const conversionId = uuid()
			/* Act */
			const conversionTry = UnoconvService
				.convertToTarget
				.bind(null, {
					conversionId,
					filePath,
					outputFilename: filename,
					targetFormat
				})
			/* Assert */
			await expect(conversionTry).rejects.toThrow(NoTargetFormatSpecifiedError)
		})
	})
	describe("It should convert files from various text-file formats to pdf", () => {
		it("should convert .txt to .pdf", async () => {
			/* Assign */
			const filePath = "./sample-input/sample.txt"
			const filename = "TXTSample"
			const targetFormat = "pdf"
			const conversionId = uuid()
			/* Act */
			const convertedFile = await UnoconvService.convertToTarget({
				conversionId,
				filePath,
				outputFilename: filename,
				targetFormat
			})
			const {
				path: convertedFilePath
			} = convertedFile
			/* Assert */
			expect(convertedFile).toHaveProperty("path")
			expect(convertedFilePath).toBe(`./out/${conversionId}.pdf`)
		})
		it("should convert .rtf to .pdf", async () => {
			/* Assign */
			const filePath = "./sample-input/sample.rtf"
			const filename = "RTFSample"
			const targetFormat = "pdf"
			const conversionId = uuid()
			/* Act */
			const convertedFile = await UnoconvService.convertToTarget({
				conversionId,
				filePath,
				outputFilename: filename,
				targetFormat
			})
			const {
				path: convertedFilePath
			} = convertedFile
			/* Assert */
			expect(convertedFile).toHaveProperty("path")
			expect(convertedFilePath).toBe(`./out/${conversionId}.pdf`)
		})
	})
	describe("It should convert files from different media formats to pdf", () => {
		it("should convert .png to .pdf", async () => {
			/* Assign */
			const filePath = "./sample-input/sample.png"
			const filename = "PNGSample"
			const targetFormat = "pdf"
			const conversionId = uuid()
			/* Act */
			const convertedFile = await UnoconvService.convertToTarget({
				conversionId,
				filePath,
				outputFilename: filename,
				targetFormat
			})
			const {
				path: convertedFilePath
			} = convertedFile
			/* Assert */
			expect(convertedFile).toHaveProperty("path")
			expect(convertedFilePath).toMatch(`./out/${conversionId}.pdf`)
		})
	})
})