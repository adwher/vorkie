import {
    Server,
    ServerConfig,
    Middleware,
    createServer,
    startServer,
} from "$/server"

import { Collection } from "$/collection"
import { Database } from "$/database"
import { Logger, LoggerConfig, createLogger } from "$/logger"

import { merge } from "lodash"

interface AppConfig {
    server: ServerConfig
    collections: Set<Collection>
    database: Database
    logger: LoggerConfig
}

export class App {
    protected readonly server: Server

    public readonly collections: Set<Collection>
    public readonly database: Database
    public readonly logger: Logger

    constructor(protected readonly config: AppConfig) {
        this.server = createServer(config.server)
        this.logger = createLogger(config.logger)

        this.collections = config.collections
        this.database = config.database
    }

    protected async beforeMount() {}

    protected async beforeUnmount() {}

    public async start() {
        await this.beforeMount()

        startServer(this.server, this.config.server)
    }

    public async close() {
        await this.beforeUnmount()
    }

    public use(fn: Middleware) {
        this.server.use(fn)
    }
}

interface CreateAppConfig {
    collections?: Array<Collection>
    server?: ServerConfig
    database: Database
}

export function createApp(config: CreateAppConfig) {
    const fallback: AppConfig = {
        server: {
            host: "localhost",
            port: 1340,
        },

        logger: {
            thresh: 0,
        },

        database: config.database,
        collections: new Set(),
    }

    if (config.collections && !Array.isArray(config.collections)) {
        throw new Error("Expected collections to be an array")
    }

    if (!config.database) {
        throw new Error("No database provided")
    }

    return new App(merge(fallback, config))
}
