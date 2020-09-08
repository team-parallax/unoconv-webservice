import { Api } from "./service/api"
import { Logger } from "./service/logger"
const api = new Api()
const logger = new Logger()
api.listen()
logger.log(`Swagger API documentation can be found here:\nhttp://localhost:3000/api-docs/`)