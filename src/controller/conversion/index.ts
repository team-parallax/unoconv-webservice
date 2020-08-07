import {
	Body, Controller, Get, Path, Post, Route, Tags
} from "tsoa"
import { ConversionService } from "../../service/conversion"
import { IConversionRequestBody } from "../../model"
import { internalServerErrorStatus } from "~/constants"
@Route("/conversion")
@Tags("Conversion")
export class ConversionController extends Controller {
	@Post("/")
	public async convertFile(
		@Body() conversionRequestBody: IConversionRequestBody
	): Promise<any> {
		this.setStatus(internalServerErrorStatus)
		return await ConversionService.convertFile(conversionRequestBody)
	}
	@Get("{fileId}")
	public async getConvertedFile(@Path() fileId: string): Promise<any> {
		return await ConversionService.getConvertedFile(fileId)
	}
}