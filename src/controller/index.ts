import {
	Controller,
	Get,
	Route,
	Tags
} from "tsoa"
import { IFormatList } from "../service/unoconv/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../service/logger"
import { UnoconvService } from "../service/unoconv"
@Route("/")
@Tags("Conversion-Formats")
export class IndexController extends Controller {
	@Inject
	private readonly logger!: Logger
	/**
	 * Returns a list of all possible formats to convert from and to.
	 */
	@Get("/formats")
	public async getSupportedFormats(): Promise<IFormatList> {
		this.logger.log("Available formats requested")
		return await UnoconvService.showAvailableFormats()
	}
}