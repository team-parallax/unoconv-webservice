import {
	Controller,
	Get,
	Post,
	Request,
	Route,
	Tags
} from "tsoa"
import { IFormatList } from "../service/unoconv/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../service/logger"
import { UnoconvService } from "../service/unoconv"
import express from "express"
import multer from "multer"
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
	@Post("/uploadtest")
	public async uploadFile(@Request() request: express.Request): Promise<unknown> {
		return await this.handleFile(request)
	}
	private async handleFile(request: express.Request): Promise<unknown> {
		const multerSingle = multer().single("randomFileIsHere")
		return new Promise((resolve, reject) => {
			multerSingle(request, express.response, (error: unknown) => {
				if (error) {
					reject(error)
				}
				resolve()
			})
		})
	}
}