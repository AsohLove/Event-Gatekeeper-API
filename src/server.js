import { logger } from "../lib/logger.js";
import { createApp } from "./app.js";
import { config } from '../src/config.js'

const app = createApp()


app.listen(config.port, () => {
    logger.info(`Gatekeeper api running on http://localhost:${config.port}`)
})