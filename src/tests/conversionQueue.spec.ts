/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConversionQueueService } from "../service/conversion/conversionQueue"
import { IConversionRequest, IConversionStatusResponse } from "../service/conversion/interface"
import { generateConversionRequests } from "./dataFactory"
import { v4 as uuid } from "uuid"
describe("ConversionQueueService should pass all tests", () => {
	describe("It should return the next element from queue or undefined if queue is empty", () => {
		it("It should create a ConversionQueueService instance with two empty queues", () => {
			/* Arrange */
			const queueService = new ConversionQueueService()
			const conversionQueue = queueService.conversionQueue
			const convertedQueue = queueService.convertedQueue
			expect(conversionQueue).toMatchObject([])
			expect(conversionQueue).toHaveLength(0)
			expect(convertedQueue).toMatchObject([])
			expect(convertedQueue).toHaveLength(0)
		})
		it("It should return undefined because of empty IConversionRequest queue", () => {
			/* Arrange */
			const queueService = new ConversionQueueService()
			/* Act */
			const nextElement: IConversionRequest | undefined = queueService.getNextQueueElement()
			/* Assert */
			expect(queueService).toBeDefined()
			expect(nextElement).toBeUndefined()
		})
		it("It should return an IConversionRequest object from queue", () => {
			/* Arrange */
			const queueService = new ConversionQueueService()
			const request: IConversionRequest = generateConversionRequests()[0]
			/* Act */
			queueService.addToConversionQueue(request)
			const nextElement: IConversionRequest | undefined = queueService.getNextQueueElement()
			/* Assert */
			expect(queueService).toBeDefined()
			expect(nextElement).toMatchObject(request)
		})
	})
	it("It should create a ConversionQueueService and add items to empty conversion queue", () => {
		/* Arrange */
		const CUuidString = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
		const queueService = new ConversionQueueService()
		const conversionQueueLength = (): number => {
			return queueService.conversionQueue.length
		}
		const initialConversionQueueLength = conversionQueueLength()
		const request: IConversionRequest = generateConversionRequests()[0]
		/* Act */
		const {
			conversionId: firstConversionQueueResponse
		} = queueService.addToConversionQueue(request)
		const delayedConversionQueueLength = conversionQueueLength()
		const {
			conversionId: secondConversionQueueResponse
		} = queueService.addToConversionQueue(request)
		const secondDelayedConversionQueueLength = conversionQueueLength()
		const {
			conversionId: thirdConversionQueueResponse
		} = queueService.addToConversionQueue(request)
		const thirdDelayedConversionQueueLength = conversionQueueLength()
		/* Assert */
		// Queue length assertions
		expect(initialConversionQueueLength).toBe(0)
		expect(delayedConversionQueueLength).toBe(1)
		expect(secondDelayedConversionQueueLength).toBe(2)
		expect(thirdDelayedConversionQueueLength).toBe(3)
		// Check if conversionId is an uuid string
		expect(firstConversionQueueResponse).toMatch(CUuidString)
		expect(secondConversionQueueResponse).toMatch(CUuidString)
		expect(thirdConversionQueueResponse).toMatch(CUuidString)
	})
	it("It should return if element is in conversionQueue", () => {
		/* Arrange */
		const queueService = new ConversionQueueService()
		const request: IConversionRequest = generateConversionRequests()[0]
		const {
			conversionId
		} = queueService.addToConversionQueue(request)
		const conversionQueue = queueService.conversionQueue
		const convertedQueue = queueService.convertedQueue
		/* Act */
		const isInConversionQueue = conversionQueue.filter(item => item.conversionId === conversionId).length > 0
		const isInConvertedQueue = convertedQueue.filter(item => item.conversionId === conversionId).length > 0
		/* Assert */
		expect(queueService).toBeDefined()
		expect(isInConversionQueue).toBe(true)
		expect(isInConvertedQueue).toBe(false)
	})
	it("It should return if element is in convertedQueue", () => {
		/* Arrange */
		const queueService = new ConversionQueueService()
		const request: IConversionRequest = generateConversionRequests()[0]
		const {
			conversionId
		} = queueService.addToConvertedQueue(request.conversionId, {
			outputFilename: request.name,
			path: request.path,
			resultFile: Buffer.from("someBuffer")
		})
		const conversionQueue = queueService.conversionQueue
		const convertedQueue = queueService.convertedQueue
		/* Act */
		const isInConversionQueue = conversionQueue.filter(item => item.conversionId === conversionId).length > 0
		const isInConvertedQueue = convertedQueue.filter(item => item.conversionId === conversionId).length > 0
		/* Assert */
		expect(queueService).toBeDefined()
		expect(isInConversionQueue).toBe(false)
		expect(isInConvertedQueue).toBe(true)
	})
	describe("It should return correct IConversionStatusResponses", () => {
		const CInQueueStatusResponse = {
			message: "in queue",
			result: undefined
		}
		const CConvertedStatusResponse = {
			message: "converted",
			result: undefined
		}
		const CIsInProgressStatusResponse = {
			message: "processing",
			result: undefined
		}
		it("It should throw an error because there is no such conversionId", () => {
			/* Arrange */
			const queueService = new ConversionQueueService()
			const nonAvailableConversionId = uuid()
			/* Act */
			const getStatus = (): IConversionStatusResponse => {
				return queueService.getStatusById(nonAvailableConversionId)
			}
			/* Assert */
			expect(getStatus).toThrow("No conversion request found for given conversionId")
		})
		it("It should return 'in queue' message", () => {
			/* Arrange */
			const queueService = new ConversionQueueService()
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId
			} = queueService.addToConversionQueue(conversionRequest)
			const getStatus = jest.fn(
				(conversionId, queueService) => queueService.getStatusById(conversionId)
			)
			/* Act */
			getStatus(conversionId, queueService)
			/* Assert */
			expect(getStatus).toReturnWith(CInQueueStatusResponse)
		})
		it("It should return with 'processing' response", () => {
			/* Arrange */
			const queueService = new ConversionQueueService()
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId
			} = queueService.addToConversionQueue(conversionRequest)
			const getStatus = jest.fn(
				(conversionId, queueService) => queueService.getStatusById(conversionId)
			)
			/* Act */
			queueService.currentlyConvertingFile = conversionRequest
			getStatus(conversionId, queueService)
			/* Assert */
			expect(getStatus).toReturnWith(CIsInProgressStatusResponse)
		})
		it("It should return with 'converted' response", () => {
			/* Arrange */
			const queueService = new ConversionQueueService()
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId,
				name,
				path
			} = conversionRequest
			const buffer = Buffer.from("someBuffer")
			queueService.addToConvertedQueue(conversionId, {
				outputFilename: name,
				path,
				resultFile: buffer
			})
			const getStatus = jest.fn(
				(conversionId, queueService) => queueService.getStatusById(conversionId)
			)
			/* Act */
			getStatus(conversionId, queueService)
			expect.assertions(3)
			expect(getStatus).toReturn()
			expect(getStatus).toReturnTimes(1)
			expect(getStatus).toReturnWith(expect.objectContaining({
				message: CConvertedStatusResponse.message,
				result: expect.objectContaining({
					conversionId,
					name,
					path,
					resultFile: buffer
				})
			}))
		})
		it("It should set 'isConverting' to false, after conversionRequest is added to 'convertedQueue'", () => {
			expect.assertions(4)
			/* Arrange */
			const queueService = new ConversionQueueService()
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId,
				name,
				path
			} = conversionRequest
			queueService.addToConvertedQueue(conversionId, {
				outputFilename: conversionRequest.name,
				path: conversionRequest.path,
				resultFile: Buffer.from("someBuffer")
			})
			const getStatus = jest.fn(
				(conversionId, queueService) => queueService.getStatusById(conversionId)
			)
			const getIsCurrentlyConvertingInfo = jest.fn(
				queueService => {
					const isCurrentlyConverting = queueService.isCurrentlyConverting
					const currentlyConvertingFile = queueService.currentlyConvertingFile
					return {
						currentlyConvertingFile,
						isCurrentlyConverting
					}
				}
			)
			/* Act */
			getStatus(conversionId, queueService)
			const {
				isCurrentlyConverting, currentlyConvertingFile
			} = getIsCurrentlyConvertingInfo(queueService)
			/* Assert */
			expect(getStatus).toReturnWith(expect.objectContaining({
				message: CConvertedStatusResponse.message,
				result: expect.anything()
			}))
			expect(getIsCurrentlyConvertingInfo).toBeCalled()
			expect(isCurrentlyConverting).toBe(false)
			expect(currentlyConvertingFile).toBe(null)
		})
	})
})