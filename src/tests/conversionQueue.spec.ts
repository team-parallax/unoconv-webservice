/* eslint-disable @typescript-eslint/no-magic-numbers */
import { ConversionQueueService } from "../service/conversion/conversionQueue"
import { EConversionStatus } from "../service/conversion/enum"
import {
	IConversionFinished,
	IConversionInProgress,
	IConversionInQueue,
	IConversionRequest,
	IConversionStatus,
	IConversionStatusResponse
} from "../service/conversion/interface"
import { NoSuchConversionIdError } from "~/constants"
import {
	generateConversionRequests,
	generateRandomNumberInInterval
} from "./dataFactory"
import { v4 as uuid } from "uuid"
describe("ConversionQueueService should pass all tests", () => {
	const conversionQueueService = new ConversionQueueService()
	beforeEach(() => {
		conversionQueueService.conversionLog = new Map()
		conversionQueueService.conversionQueue = []
		conversionQueueService.convertedQueue = []
	})
	describe("It should return the next element from queue or undefined if queue is empty", () => {
		it("should create a ConversionQueueService instance with two empty queues", () => {
			/* Arrange */
			expect(conversionQueueService.conversionQueue).toMatchObject([])
			expect(conversionQueueService.conversionQueue).toHaveLength(0)
			expect(conversionQueueService.convertedQueue).toMatchObject([])
			expect(conversionQueueService.convertedQueue).toHaveLength(0)
		})
		it("should return undefined because of empty IConversionRequest queue", () => {
			/* Arrange */
			/* Act */
			// eslint-disable-next-line max-len
			const nextElement: IConversionRequest | undefined = conversionQueueService.getNextQueueElement()
			/* Assert */
			expect(conversionQueueService).toBeDefined()
			expect(nextElement).toBeUndefined()
		})
		it("should return an IConversionRequest object from queue", () => {
			/* Arrange */
			const conversionQueue = new ConversionQueueService()
			const request: IConversionRequest = generateConversionRequests()[0]
			/* Act */
			conversionQueue.addToConversionQueue(request)
			// eslint-disable-next-line max-len
			const nextElement: IConversionRequest | undefined = conversionQueue.getNextQueueElement()
			/* Assert */
			expect(conversionQueue).toBeDefined()
			expect(nextElement).toMatchObject(request)
		})
	})
	it("should create a ConversionQueueService and add items to empty conversion queue", () => {
		/* Arrange */
		const CUuidString = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
		const conversionQueueLength = (): number => {
			return conversionQueueService.conversionQueue.length
		}
		const initialConversionQueueLength = conversionQueueLength()
		const request: IConversionRequest = generateConversionRequests()[0]
		/* Act */
		const {
			conversionId: firstConversionQueueResponse
		} = conversionQueueService.addToConversionQueue(request)
		const delayedConversionQueueLength = conversionQueueLength()
		const {
			conversionId: secondConversionQueueResponse
		} = conversionQueueService.addToConversionQueue(request)
		const secondDelayedConversionQueueLength = conversionQueueLength()
		const {
			conversionId: thirdConversionQueueResponse
		} = conversionQueueService.addToConversionQueue(request)
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
	it("should return if element is in conversionQueue", () => {
		/* Arrange */
		const request: IConversionRequest = generateConversionRequests()[0]
		const {
			conversionId
		} = conversionQueueService.addToConversionQueue(request)
		const conversionQueue = conversionQueueService.conversionQueue
		const convertedQueue = conversionQueueService.convertedQueue
		/* Act */
		const isInConversionQueue = conversionQueue.filter(
			item => item.conversionId === conversionId
		).length > 0
		const isInConvertedQueue = convertedQueue.filter(
			item => item.conversionId === conversionId
		).length > 0
		/* Assert */
		expect(conversionQueue).toBeDefined()
		expect(isInConversionQueue).toBe(true)
		expect(isInConvertedQueue).toBe(false)
	})
	it("should return if element is in convertedQueue", () => {
		/* Arrange */
		const request: IConversionRequest = generateConversionRequests()[0]
		const {
			conversionId,
			name,
			path
		} = request
		conversionQueueService.conversionLog.set(conversionId, {
			failures: 0,
			status: EConversionStatus.converted
		})
		conversionQueueService.addToConvertedQueue(conversionId, {
			outputFilename: name,
			path
		})
		const conversionQueue = conversionQueueService.conversionQueue
		const convertedQueue = conversionQueueService.convertedQueue
		/* Act */
		const isInConversionQueue = conversionQueue.filter(
			item => item.conversionId === conversionId
		).length > 0
		const isInConvertedQueue = convertedQueue.filter(
			item => item.conversionId === conversionId
		).length > 0
		/* Assert */
		expect(conversionQueue).toBeDefined()
		expect(isInConversionQueue).toBe(false)
		expect(isInConvertedQueue).toBe(true)
	})
	describe("It should return correct IConversionStatusResponses", () => {
		const buffer = Buffer.from("someBuffer")
		const CInQueueStatusResponse = {
			failures: 0,
			status: "in queue"
		}
		const CConvertedStatusResponse = {
			failures: 0,
			resultFile: undefined,
			status: "converted"
		}
		const CIsInProgressStatusResponse = {
			failures: 0,
			status: "processing"
		}
		const getStatus = jest.fn(
			(conversionId, conversionQueue) => conversionQueue.getStatusById(conversionId)
		)
		// eslint-disable-next-line dot-notation
		conversionQueueService["response"] = jest.fn(
			(status: EConversionStatus, conversionId: string): IConversionStatus => {
				const failures = conversionQueueService.getConversionFailureAttempts(conversionId)
				const baseResp: IConversionInProgress = {
					conversionId,
					failures,
					status
				}
				switch (status) {
					case EConversionStatus.converted: {
						const convertedFile = conversionQueueService.convertedQueue
							.filter(item => item.conversionId === conversionId)[0]
						const response: IConversionFinished = {
							...baseResp,
							resultFile: buffer
						}
						return response
					}
					case EConversionStatus.erroneous: {
						const newFailureCounter = conversionQueueService
							.getConversionFailureAttempts(conversionId) + 1
						return {
							...baseResp,
							failures: newFailureCounter
						}
					}
					case EConversionStatus.inQueue: {
						// Add one to have 1-indexed queue
						const queuePosition: number = conversionQueueService
							.getConversionQueuePosition(conversionId)
						const response: IConversionInQueue = {
							...baseResp,
							queuePosition
						}
						return response
					}
					default:
						return baseResp
				}
			}
		)
		it("should throw an error because there is no such conversionId", () => {
			/* Arrange */
			const nonAvailableConversionId = uuid()
			/* Act */
			const getStatus = (): IConversionStatusResponse => {
				return conversionQueueService.getStatusById(nonAvailableConversionId)
			}
			/* Assert */
			expect(
				getStatus
			).toThrowError(NoSuchConversionIdError)
		})
		it("should return 'in queue' message", () => {
			/* Arrange */
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId
			} = conversionQueueService.addToConversionQueue(conversionRequest)
			const queuePosition: number = conversionQueueService.conversionQueue.findIndex(
				item => item.conversionId === conversionId
			) + 1
			/* Act */
			getStatus(conversionId, conversionQueueService)
			/* Assert */
			expect(getStatus).toReturnWith({
				...CInQueueStatusResponse,
				conversionId,
				queuePosition
			})
		})
		it("should return with 'processing' response", () => {
			/* Arrange */
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId
			} = conversionQueueService.addToConversionQueue(conversionRequest)
			// Const getStatus = jest.fn(
			// 	(conversionId, conversionQueue) => conversionQueue.getStatusById(conversionId)
			// )
			/* Act */
			conversionQueueService.currentlyConvertingFile = conversionRequest
			getStatus(conversionId, conversionQueueService)
			/* Assert */
			expect(getStatus).toReturnWith({
				...CIsInProgressStatusResponse,
				conversionId
			})
		})
		it("should return with 'converted' response", () => {
			/* Arrange */
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId,
				name,
				path
			} = conversionRequest
			conversionQueueService.conversionLog.set(conversionId, {
				failures: 0,
				status: EConversionStatus.converted
			})
			conversionQueueService.addToConvertedQueue(conversionId, {
				outputFilename: name,
				path
			})
			// Const getStatus = jest.fn(
			// 	(conversionId, conversionQueue) => conversionQueue.getStatusById(conversionId)
			// )
			/* Act */
			getStatus(conversionId, conversionQueueService)
			expect(getStatus).toReturn()
			// Expect(getStatus).toReturnTimes(1)
			expect(getStatus).toReturnWith({
				conversionId,
				failures: 0,
				resultFile: buffer,
				status: CConvertedStatusResponse.status
			})
		})
		it("should set 'isConverting' to false, after conversionRequest is added to 'convertedQueue'", () => {
			/* Arrange */
			const buffer = Buffer.from("someBuffer")
			const conversionRequest = generateConversionRequests()[0]
			const {
				conversionId,
				name,
				path
			} = conversionRequest
			conversionQueueService.conversionLog.set(conversionId, {
				failures: 0,
				status: EConversionStatus.converted
			})
			conversionQueueService.addToConvertedQueue(conversionId, {
				outputFilename: name,
				path
			})
			// Const getStatus = jest.fn(
			// 	(conversionId, conversionQueue) => conversionQueue.getStatusById(conversionId)
			// )
			const getIsCurrentlyConvertingInfo = jest.fn(
				conversionQueue => {
					const isCurrentlyConverting = conversionQueue.isCurrentlyConverting
					const currentlyConvertingFile = conversionQueue.currentlyConvertingFile
					return {
						currentlyConvertingFile,
						isCurrentlyConverting
					}
				}
			)
			/* Act */
			getStatus(conversionId, conversionQueueService)
			const {
				isCurrentlyConverting, currentlyConvertingFile
			} = getIsCurrentlyConvertingInfo(conversionQueueService)
			/* Assert */
			expect(getStatus).toReturnWith({
				conversionId,
				failures: 0,
				resultFile: buffer,
				status: CConvertedStatusResponse.status
			})
			expect(getIsCurrentlyConvertingInfo).toBeCalled()
			expect(isCurrentlyConverting).toBe(false)
			expect(currentlyConvertingFile).toBe(null)
		})
	})
	describe("It should handle the convlog correctly", () => {
		it("Convlog should initially be empty", () => {
			const convlogLength = conversionQueueService.conversionLog.size
			expect(convlogLength).toBe(0)
		})
		// eslint-disable-next-line jest/no-focused-tests
		it(
			"It should correctly change the status of one random convlog-item",
			() => {
				/* Arrange */
				const initialConvLogLength = conversionQueueService.conversionLog.size
				const sampleSize = 5
				const randomSampleIndex = generateRandomNumberInInterval(sampleSize - 1)
				for (let i = 0; i < sampleSize; i++) {
					const conversionId = uuid()
					conversionQueueService.conversionLog.set(conversionId, {
						failures: 0,
						status: EConversionStatus.inQueue
					})
				}
				const hydratedConvLogLength = conversionQueueService.conversionLog.size
				const randomSampleNewStatus = EConversionStatus.processing
				// eslint-disable-next-line max-len
				const [...convLogElements] = conversionQueueService.conversionLog.entries()
				const [id, convObj] = convLogElements[randomSampleIndex]
				/* Act */
				conversionQueueService.changeConvLogEntry(
					id,
					randomSampleNewStatus
				)
				/* Assert */
				expect(initialConvLogLength).toBe(0)
				expect(hydratedConvLogLength).toBe(sampleSize)
				expect(convObj.status).toBe(randomSampleNewStatus)
			}
		)
	})
})