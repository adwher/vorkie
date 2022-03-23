import { Field } from "$/field"
import { entries } from "lodash"

interface CollectionConfig {
    /**
     * Plural collection name
     * @example "users"
     * */
    name: string

    /** Define a description to the collection */
    description?: string

    /** Describe the fields used by the collection */
    schema: Record<string, Field>
}

export class Collection {
    public name: string
    protected schema: Map<string, Field>

    constructor(protected readonly config: CollectionConfig) {
        this.name = config.name
        this.schema = new Map(entries(config.schema))
    }
}

interface CreateCollectionConfig extends CollectionConfig {}

export function createCollection(config: CreateCollectionConfig): Collection {
    return new Collection(config)
}
