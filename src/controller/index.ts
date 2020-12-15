import {
	Controller,
	Example,
	Get,
	Route,
	Tags
} from "tsoa"
import { EHttpResponseCodes } from "../constants"
import { IFormatList } from "../service/unoconv/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../service/logger"
import { UnoconvService } from "../service/unoconv"
@Route("/")
export class IndexController extends Controller {
	@Inject
	private readonly logger!: Logger
	/**
	 * Returns 'pong' on request.
	 * This can be used to check if the webservice is up
	 * before trying to fetch data.
	 */
	@Tags("Misc.")
	@Get("/ping")
	@Example<string>("pong")
	public getPingResponse(): string {
		this.logger.log("Received 'ping' signal.")
		this.setStatus(EHttpResponseCodes.ok)
		return "pong"
	}
	/**
	 * Returns a list of all possible formats to convert from and to.
	 */
	@Tags("Conversion-Formats")
	@Get("/formats")
	public async getSupportedFormats(): Promise<IFormatList> {
		this.logger.log("Available formats requested")
		return await UnoconvService.showAvailableFormats()
	}
}