import { ConversionService } from "../service/conversion"
import { IConversionRequestBody } from "~/service/conversion/interface"
import { generateConversionRequestBodies } from "./dataFactory"
describe("ConversionService should pass all tests", () => {
	it("It should initialize an service with queue-length of 0 and not-converting status", () => {
		/* Arrange */
		const service = new ConversionService()
		/* Act */
		const queueLength = service.queueLength
		const isConverting = service.isCurrentlyConverting
		/* Assert */
		expect(queueLength).toBe(0)
		expect(isConverting).toBe(false)
	})
	it("It should add items to the queue and return a uuid-string and correct current status for each element", async done => {
		/* Arrange */
		const dataSetSize = 3
		const service = new ConversionService()
		const getQueueLength = (): number => service.queueLength
		const conversionRequestBodies: IConversionRequestBody[] = generateConversionRequestBodies("txt", "pdf", dataSetSize)
		const initialQueueLength = getQueueLength()
		const responses = await Promise.all(conversionRequestBodies.map(
			async requestBody => await service.processConversionRequest(requestBody)
		))
		const getStatus = jest.fn(
			(conversionId, queueService) => queueService.getStatusById(conversionId)
		)
		/* Act */
		const [
			firstResponse,
			...convProcessingResps
		] = responses
		console.log(responses)
		const latestQueueLength = getQueueLength()
		const {
			conversionId: firstConversionId
		} = firstResponse
		getStatus(firstConversionId, service.queueService)
		for (const conversionRequest of convProcessingResps) {
			getStatus(conversionRequest.conversionId, service.queueService)
		}
		/* Assert */
		expect(firstConversionId).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
		expect(initialQueueLength).toBe(0)
		expect(latestQueueLength).toBe(dataSetSize - 1)
		expect(service.isCurrentlyConverting).toBe(true)
		expect(getStatus).nthReturnedWith(1, {
			conversionId: firstConversionId,
			status: "processing"
		})
		for (const response of convProcessingResps) {
			// Add 1 to make it 1-indexed
			const index = convProcessingResps.indexOf(response) + 1
			// Add 1 to 'include' first conversion to the conversion-stack
			const stackIndex = index + 1
			expect(response.conversionId).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
			expect(getStatus).nthReturnedWith(stackIndex, {
				conversionId: response.conversionId,
				queuePosition: index,
				status: "in queue"
			})
		}
		done()
	})
})