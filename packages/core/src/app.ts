import {
    Server,
    ServerConfig,
    Middleware,
    createServer,
    startServer,
} from "./server"

import { Collection } from "./collection"
import { Database } from "./database"
import { Logger, LoggerConfig, LoggerLevel, createLogger } from "./logger"
import { Plugin } from "./plugins"

import { mapper } from "./utils"

export interface AppConfig {
    server: ServerConfig
    collections: Map<string, Collection>
    database: Database
    logger: LoggerConfig
    plugins: Map<string, Plugin>
}

export class App {
    protected readonly server: Server
    protected readonly plugins: Map<string, Plugin>
    protected readonly config: AppConfig

    public readonly collections: Map<string, Collection>
    public readonly database: Database
    public readonly logger: Logger

    protected mounted: boolean

    constructor(config: AppConfig) {
        this.database = config.database
        this.plugins = config.plugins

        for (const [name, plugin] of config.plugins) {
            config = plugin.beforeCreated?.(config) ?? config
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
        for (const [name, collection] of this.collections) {
            this.logger.debug(`Migrating "${name}" collection`)
            await this.database.migrate(collection)
        }

        for (const [name, plugin] of this.plugins) {
            this.logger.debug(`Mounting "${name}" plugin`)
            await plugin.beforeMount?.(this)
        }
    }

    public async start() {
        await this.beforeMount()
        await startServer(this.server, this.config.server)

        this.logger.debug("Server was mounted")
        this.mounted = true
    }

    protected async beforeUnmount() {
        for (const [name, plugin] of this.plugins) {
            this.logger.debug(`Unmounting "${name}" plugin`)
            await plugin.beforeUnmount?.(this)
        }
    }

    public async close() {
        await this.beforeUnmount()

        this.logger.debug("Server was unmounted")
        this.mounted = false
    }

    /**
     * Defines a usage of server middleware.
     * @see https://github.com/lukeed/trouter#handlers
     */
    public use(fn: Middleware) {
        this.server.use(fn)
    }

    /**
     * Defines server a middleware in a expecific route.
     * The URL must match the defined pattern exactly or have the appropriate optional and/or wildcard segments.
     * @see https://github.com/lukeed/trouter#trouterallpattern-handlers
     */
    public at(path: string, fn: Middleware) {
        this.server.all(path, fn)
    }
}

interface CreateAppConfig {
    collections?: Array<Collection>
    server?: ServerConfig
    logger?: LoggerConfig
    database: Database
    plugins?: Array<Plugin>
}

/**
 * Defines a new application instance.
 * @param config Configuration for the app
 * @returns An {@link App} instance
 */
export function createApp(config: CreateAppConfig) {
    if (config.collections && !Array.isArray(config.collections)) {
        throw new Error("Expected collections to be an array")
    }

    if (!config.database) {
        throw new Error("No database provided")
    }

    const collections = mapper(config.collections ?? [], "name")
    const plugins = mapper(config.plugins ?? [], "name")

    const fallback: AppConfig = {
        server: {
            host: "localhost",
            port: 1340,

            ...config.server,
        },

        logger: {
            thresh: LoggerLevel.INFO,
            ...config.logger,
        },

        database: config.database,

        collections: collections,
        plugins: plugins,
    }

    return new App(fallback)
}
