import { ConversionService } from "../service/conversion"
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
	// Todo: Refactor!
	// It("It should add items to the queue and return a uuid-string and correct current status for each element", () => {
	// 	/* Arrange */
	// 	Const dataSetSize = 3
	// 	Const service = new ConversionService()
	// 	Const getQueueLength = (): number => service.queueLength
	// 	Const conversionRequestBodies: IConversionRequestBody[] = generateConversionRequestBodies("txt", "pdf", dataSetSize)
	// 	Const initialQueueLength = getQueueLength()
	// 	Const responses = conversionRequestBodies.map(
	// 		Async requestBody => await service.processConversionRequest(requestBody)
	// 	)
	// 	Const getStatus = jest.fn(
	// 		(conversionId, queueService) => queueService.getStatusById(conversionId)
	// 	)
	// 	/* Act */
	// 	Const [
	// 		FirstResponse,
	// 		...convProcessingResps
	// 	]: IConversionProcessingResponse[] = responses.data
	// 	Const latestQueueLength = getQueueLength()
	// 	Const {
	// 		ConversionId: firstConversionId
	// 	} = firstResponse
	// 	GetStatus(firstConversionId, service.queueService)
	// 	For (const conversionRequest of convProcessingResps) {
	// 		GetStatus(conversionRequest.conversionId, service.queueService)
	// 	}
	// 	/* Assert */
	// 	Expect(firstConversionId).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
	// 	Expect(initialQueueLength).toBe(0)
	// 	Expect(latestQueueLength).toBe(dataSetSize - 1)
	// 	Expect(service.isCurrentlyConverting).toBe(true)
	// 	Expect(getStatus).nthReturnedWith(1, {
	// 		Message: "processing",
	// 		Result: undefined
	// 	})
	// 	For (const response of convProcessingResps) {
	// 		// Add 1 to make it 1-indexed
	// 		Const index = convProcessingResps.indexOf(response) + 1
	// 		Expect(response.conversionId).toMatch(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i)
	// 		// Add 1 to 'include' first conversion to stack
	// 		Expect(getStatus).nthReturnedWith(index + 1, {
	// 			Message: "in queue",
	// 			Result: undefined
	// 		})
	// 	}
	// })
})