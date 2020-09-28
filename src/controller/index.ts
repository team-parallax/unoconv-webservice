import {
	Controller,
	Get,
	Route,
	Tags
} from "tsoa"
import { IFormatList } from "../service/unoconv/interface"
import { UnoconvService } from "../service/unoconv"
@Route("/")
@Tags("Conversion-Formats")
export class IndexController extends Controller {
	/**
	 * Returns a list of all possible formats to convert from and to.
	 */
	@Get("/formats")
	public async getSupportedFormats(): Promise<IFormatList> {
		return await UnoconvService.showAvailableFormats()
	}
}