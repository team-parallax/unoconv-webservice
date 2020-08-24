import { ConverterService } from "../service/conversion"
import { IConversionRequestBody } from "../service/conversion/interface"
describe("ConversionService should pass all tests", () => {
	describe("ConversionService should be created successful and handle all tasks properly", () => {
		it("should create a Service with an emty queue", () => {
			/* Arrange */
			const service = new ConverterService()
			expect(service.queueLength).toBe(0)
		})
		it("should create a Service and handle the three requests correctly -> queue two of them", () => {
			/* Arrange */
			const requestBodyPng: IConversionRequestBody = {
				filename: "sample",
				originalFormat: "png",
				targetFormat: "pdf"
			}
			const requestBodyTxt: IConversionRequestBody = {
				filename: "sample",
				originalFormat: "txt",
				targetFormat: "pdf"
			}
			const requestBodyRtf: IConversionRequestBody = {
				filename: "sample",
				originalFormat: "rtf",
				targetFormat: "pdf"
			}
			const service = new ConverterService()
			/* Act */
			const {
				conversionId: conversionIdPng
			} = service.processConversionRequest(requestBodyPng)
			const {
				conversionId: conversionIdTxt
			} = service
				.processConversionRequest(requestBodyTxt)
			const {
				conversionId: conversionIdRtf
			} = service.processConversionRequest(requestBodyRtf)
			const queueLength = service.queueLength
			const isConverting = service.isCurrentlyConverting
			const expectedQueueLength = 2
			/* Assert */
			expect(conversionIdPng).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
			expect(conversionIdTxt).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
			expect(conversionIdRtf).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
			expect(queueLength).toBeGreaterThanOrEqual(expectedQueueLength)
			expect(isConverting).toBe(true)
		})
		it("should create a Service and respond to the status requests", () => {
			/* Arrange */
			const requestBodyPng: IConversionRequestBody = {
				filename: "sample",
				originalFormat: "png",
				targetFormat: "pdf"
			}
			const requestBodyTxt: IConversionRequestBody = {
				filename: "sample",
				originalFormat: "txt",
				targetFormat: "pdf"
			}
			const requestBodyRtf: IConversionRequestBody = {
				filename: "sample",
				originalFormat: "rtf",
				targetFormat: "pdf"
			}
			const service = new ConverterService()
			/* Act */
			const {
				conversionId: conversionIdPng
			} = service.processConversionRequest(requestBodyPng)
			const {
				conversionId: conversionIdTxt
			} = service
				.processConversionRequest(requestBodyTxt)
			const {
				conversionId: conversionIdRtf
			} = service.processConversionRequest(requestBodyRtf)
			const queueLength = service.queueLength
			const isConverting = service.isCurrentlyConverting
			const expectedQueueLength = 2
			const {
				message: pngStatusMessage
			} = service.getConvertedFile(conversionIdPng)
			setTimeout(done => {
				const {
					message: pngStatusMessageDelayed
				} = service.getConvertedFile(conversionIdPng)
				expect(pngStatusMessage).toBe("converted")
				const {
					message: txtStatusMessageDelayed
				} = service.getConvertedFile(conversionIdTxt)
				expect(txtStatusMessage).toBe("processing")
				done()
			// eslint-disable-next-line @typescript-eslint/no-magic-numbers
			}, 5000)
			const {
				message: txtStatusMessage
			} = service.getConvertedFile(conversionIdTxt)
			const {
				message: rtfStatusMessage
			} = service.getConvertedFile(conversionIdRtf)
			// Console.log(conversionStatusTxt
			/* Assert */
			expect(conversionIdPng).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
			expect(conversionIdTxt).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
			expect(conversionIdRtf).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
			expect(queueLength).toBeGreaterThanOrEqual(expectedQueueLength)
			expect(isConverting).toBe(true)
			expect(pngStatusMessage).toBe("processing")
			expect(rtfStatusMessage).toBe("in Queue")
			expect(txtStatusMessage).toBe("in Queue")
		})
	})
})