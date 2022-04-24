import { Database as Connector } from "arangojs"
import { Collection, Database } from "vorkie"
import { ArangoQueryBuilder } from "./query"

interface ArangoDBConfig {
    url: string
    database: string
    credentials?: {
        username: string
        password: string
    }
}

export class ArangoDatabase implements Database {
    protected readonly connector: Connector
    protected readonly collections: Map<string, Collection>

    constructor(protected readonly config: ArangoDBConfig) {
        this.collections = new Map()

        this.connector = new Connector({
            url: config.url,
            databaseName: config.database,
            auth: config.credentials,
        })
    }

    public async migrate(collection: Collection) {
        if (this.collections.has(collection.name)) return

        const table = this.connector.collection(collection.name)
        const exist = await table.exists()

        this.collections.set(collection.name, collection)

        if (!exist) await table.create()
    }

    public async raw(query: unknown, params: Record<string, unknown>) {
        if (typeof query !== "string") {
            throw new Error("Query must be a string")
        }

        return this.connector.query(query, params)
    }

    from(name: string) {
        const collection = this.collections.get(name)

        if (collection) {
            return new ArangoQueryBuilder(this.connector, collection)
        }

        throw new Error(`Collection '${name}' not defined`)
    }
}
