import {
    Server,
    ServerConfig,
    Middleware,
    createServer,
    startServer,
} from "$/server"

import { Collection } from "$/collection"
import { Database } from "$/database"
import { Logger, LoggerConfig, LoggerLevel, createLogger } from "$/logger"
import { Plugin } from "$/plugins"

export interface AppConfig {
    server: ServerConfig
    collections: Set<Collection>
    database: Database
    logger: LoggerConfig
    plugins: Set<Plugin>
}

export class App {
    protected readonly server: Server
    protected readonly plugins: Set<Plugin>
    protected readonly config: AppConfig

    public readonly collections: Set<Collection>
    public readonly database: Database
    public readonly logger: Logger

    protected mounted: boolean

    constructor(config: AppConfig) {
        this.database = config.database
        this.plugins = config.plugins

        for (const plugin of config.plugins) {
            config = plugin.beforeCreated(config)
        }

        this.collections = config.collections
        this.config = config

        this.server = createServer(config.server)
        this.logger = createLogger(config.logger)

        this.mounted = false
    }

    public isMounted() {
        return this.mounted
    }

    protected async beforeMount() {
        for (const collection of this.collections) {
            await this.database.migrate(collection)
        }

        for (const plugin of this.plugins) {
            await plugin.beforeMount?.()
        }
    }

    public async start() {
        await this.beforeMount()
        await startServer(this.server, this.config.server)

        this.mounted = true
    }

    protected async beforeUnmount() {
        for (const plugin of this.plugins) {
            await plugin.beforeUnmount?.()
        }
    }

    public async close() {
        await this.beforeUnmount()

        this.mounted = false
    }

    public use(fn: Middleware) {
        this.server.use(fn)
    }
}

interface CreateAppConfig {
    collections?: Array<Collection>
    server?: ServerConfig
    database: Database
    plugins?: Array<Plugin>
}

export function createApp(config: CreateAppConfig) {
    if (config.collections && !Array.isArray(config.collections)) {
        throw new Error("Expected collections to be an array")
    }

    if (!config.database) {
        throw new Error("No database provided")
    }

    const fallback: AppConfig = {
        server: {
            host: "localhost",
            port: 1340,

            ...config.server,
        },

        logger: {
            thresh: LoggerLevel.INFO,
        },

        database: config.database,

        collections: new Set(config.collections),
        plugins: new Set(config.plugins),
    }

    return new App(fallback)
}
