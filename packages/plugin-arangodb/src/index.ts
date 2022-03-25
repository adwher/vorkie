import { ArangoDatabase } from "./database"

interface CreateDatabaseConfig {
    url: string
    database: string
    credentials?: {
        username: string
        password: string
    }
}

export function createDatabase(config: CreateDatabaseConfig) {
    return new ArangoDatabase(config)
}
