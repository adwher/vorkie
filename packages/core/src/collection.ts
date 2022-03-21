import { Field } from "$/field"

interface CollectionConfig {
    /**
     * Plural collection name
     * @example "users"
     * */
    name: string

    /** Define a description to the collection */
    description?: string

    /** Describe the fields used by the collection */
    fields: Array<Field>
}

export class Collection {
    constructor(protected readonly config: CollectionConfig) {}
}

interface CreateCollectionConfig extends CollectionConfig {}

export function createCollection(config: CreateCollectionConfig): Collection {
    return new Collection(config)
}
