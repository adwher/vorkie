import { Server, ServerConfig, createServer, startServer } from "$/server"
import { Collection } from "$/collection"
import { Database } from "$/database"

import { merge } from "lodash"

interface AppConfig {
    server: ServerConfig
    collections: Set<Collection>
    database: Database
}

export class App {
    protected server: Server
    protected collections: Set<Collection>
    protected database: Database

    constructor(protected readonly config: AppConfig) {
        this.server = createServer(config.server)
        this.collections = config.collections
        this.database = config.database
    }

    // Lifecycle

    protected async beforeMount() {}

    protected async beforeUnmount() {}

    // Controllers

    public async start() {
        await this.beforeMount()

        startServer(this.server, this.config.server)
    }

    public async close() {
        await this.beforeUnmount()
    }
}

interface CreateAppConfig {
    collections?: Set<Collection>
    server?: ServerConfig
    database: Database
}

export function createApp(config: CreateAppConfig) {
    const fallback: AppConfig = {
        server: {
            host: "localhost",
            port: 1340,
        },

        collections: new Set(),

        database: config.database,
    }

    if (!config.database) {
        throw new Error("No database provided")
    }

    return new App(merge(fallback, config))
}
