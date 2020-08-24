import { EHttpResponseCodes } from "../../constants"
import { RegisterRoutes } from "../../routes/routes"
import bodyParser from "body-parser"
import cors from "cors"
import express, {
	Application, Express, NextFunction, Request, Response
} from "express"
import swaggerDocument from "../../../swagger.json"
import swaggerUi from "swagger-ui-express"
export class Api {
	private readonly _port: number
	private readonly app: Application
	private readonly defaultPort: number = 3000
	constructor(port?: number) {
		this.app = express()
		this._port = port ?? this.defaultPort
		this.configureServer()
		this.addApi()
	}
	listen = (): void => {
		this.app.listen(this.port, () => {
			console.log(`Listening on port ${this.port}`)
		})
	}
	private readonly addApi = (): void => {
		const {
			internalServerError
		} = EHttpResponseCodes
		this.app.get("/", (req, res, err) => {
			res.send("Request received")
		})
		RegisterRoutes(this.app as Express)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument as any))
		this.app.get("/swagger.json", (req: Request, res: Response) => res.json(swaggerDocument))
		this.app.use((
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			err: any,
			req: Request,
			res: Response,
			next: NextFunction
		) => {
			const status = err.status || internalServerError
			console.error(err)
			const body = {
				fields: err.fields || undefined,
				message: err.message || "An error occurred during the request.",
				name: err.name,
				status
			}
			res.status(status).json(body)
			next()
		})
	}
	private readonly configureServer = (): void => {
		// Mount json form parser
		this.app.use(cors())
		// Set max limit
		this.app.use(bodyParser.urlencoded({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			extended: true,
			limit: "50mb"
		}))
		this.app.use(bodyParser.json({
			limit: "50mb"
		}))
		// This.app.use(methodOverride());
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.header("Access-Control-Allow-Origin", "*")
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
			console.log(`Request received: ${req.method} ${req.url}`)
			next()
		})
	}
	get port(): number {
		return this._port
	}
}