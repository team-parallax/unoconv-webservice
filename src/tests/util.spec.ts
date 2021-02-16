import {
	CMaxAllowedConversionFailuresFallback,
	CMaxAllowedConversionTimeFallback,
	CommandNotFoundError,
	ConfigurationValueError,
	EMaxValue
} from "../constants"
import { config } from "dotenv"
import {
	executeShellCommand,
	getMaxAllowedConversionValues,
	resolvePath
} from "../service/util"
describe("Util functions should pass all tests", () => {
	it("It should throw an Error because of an unrecognized command", async done => {
		/* Arrange */
		const command = "unknownCommand"
		const shellPromise = executeShellCommand(command)
		/* Assert */
		await expect(shellPromise).rejects.toBeInstanceOf(CommandNotFoundError)
		await expect(shellPromise).rejects.toThrowError("Command could not be found.")
		done()
	})
	it(
		"It should list all file names and directories with a line number in the current directory",
		async done => {
			/* Arrange */
			const command = "ls -al | awk '{ print NR \" \"  $9 }'"
			const shellPromise = await executeShellCommand(command)
			/* Assert */
			expect(typeof shellPromise).toBe("string")
			done()
		}
	)
	describe("It should return correct configuration values", () => {
		beforeAll(() => {
			config({
				path: resolvePath("./example.env")
			})
		})
		describe("It should handle incorrect values", () => {
			it("should throw an error because of non-existent env-var", () => {
				/* Arrange */
				// eslint-disable-next-line dot-notation
				const testConfigValue = EMaxValue["nonexistent"]
				const getConfigValue = jest.fn(
					() => getMaxAllowedConversionValues(testConfigValue)
				)
				/* Assert */
				expect(getConfigValue).toThrowError(ConfigurationValueError)
			})
			it("should throw an error because of an undefined env-var", () => {
				/* Arrange */
				// eslint-disable-next-line dot-notation
				const testConfigValue = EMaxValue["undefined"]
				const getConfigValue = jest.fn(
					() => getMaxAllowedConversionValues(testConfigValue)
				)
				/* Assert */
				expect(getConfigValue).toThrowError(ConfigurationValueError)
			})
		})
		describe("It should handle maximum conversionTime config variable", () => {
			it("should return the fallback for max conversionTime", () => {
				/* Arrange */
				process.env.MAX_CONVERSION_TIME = undefined
				/* Assert */
				expect(
					getMaxAllowedConversionValues(EMaxValue.conversionTime)
				).toBe(CMaxAllowedConversionTimeFallback)
			})
		})
		describe("It should handle maximum conversion retries env war", () => {
			it("should return the max tries fallback", () => {
				/* Arrange */
				process.env.MAX_CONVERSION_RETRIES = undefined
				/* Assert */
				expect(
					getMaxAllowedConversionValues(EMaxValue.failures)
				).toBe(CMaxAllowedConversionFailuresFallback)
			})
		})
	})
})