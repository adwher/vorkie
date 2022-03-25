import { Database as Connector } from "arangojs"
import { Collection, Database } from "vormik"
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
    protected connector: Connector

    constructor(protected readonly config: ArangoDBConfig) {
        this.connector = new Connector({
            url: config.url,
            databaseName: config.database,
            auth: config.credentials,
        })
    }

    async migrate(collections: Set<Collection>) {
        for (const collection of collections) {
            const table = this.connector.collection(collection.name)
            const exist = await table.exists()

            if (exist) continue
            await table.create()
        }
    }

    async raw(query: unknown, params: Record<string, unknown>) {
        if (typeof query !== "string") {
            throw new Error("Query must be a string")
        }

        return this.connector.query(query, params)
    }

    from(collection: Collection | string) {
        return new ArangoQueryBuilder(this.connector, collection)
    }
}
