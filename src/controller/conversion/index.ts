import {
	Body, Controller, Get, Path, Post, Route, Tags
} from "tsoa"
import { ConversionService } from "../../service/conversion"
import { EHttpResponseCodes } from "../../constants"
import {
	IConversionProcessingResponse, IConversionRequestBody, IConversionStatusResponse
} from "../../service/conversion/interface"
import { Inject } from "typescript-ioc"
@Route("/conversion")
@Tags("Conversion")
export class ConversionController extends Controller {
	@Inject
	private readonly conversionService!: ConversionService
	@Post("/")
	public async convertFile(
		@Body() conversionRequestBody: IConversionRequestBody
	): Promise<IConversionProcessingResponse> {
		return await this.conversionService.processConversionRequest(conversionRequestBody)
	}
	@Get("{fileId}")
	public getConvertedFile(@Path() fileId: string): IConversionStatusResponse {
		try {
			return this.conversionService.getConvertedFile(fileId)
		}
		catch (err) {
			this.setStatus(EHttpResponseCodes.notFound)
			return {
				message: err.message
			}
		}
	}
}