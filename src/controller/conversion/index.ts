import {
	Body, Controller, Get, Path, Post, Route, Tags
} from "tsoa"
import { ConverterService } from "../../service/conversion"
import { EHttpResponseCodes } from "../../constants"
import { IConversionRequestBody, IConversionStatusResponse } from "../../service/conversion/interface"
@Route("/conversion")
@Tags("Conversion")
export class ConversionController extends Controller {
	@Post("/")
	public convertFile(
		@Body() conversionRequestBody: IConversionRequestBody
	): unknown {
		this.setStatus(EHttpResponseCodes.internalServerError)
		return new ConverterService().processConversionRequest(conversionRequestBody)
	}
	@Get("{fileId}")
	public getConvertedFile(@Path() fileId: string): IConversionStatusResponse {
		return new ConverterService().getConvertedFile(fileId)
	}
}