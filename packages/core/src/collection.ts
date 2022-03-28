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
    public readonly name: string
    public readonly schema: Map<string, Field>

    constructor(protected readonly config: CollectionConfig) {
        this.name = config.name
        this.schema = new Map(entries(config.schema))
    }

    /** Creates a {@link Collection} instance from their config */
    static from(config: CollectionConfig) {
        return new Collection(config)
    }

    addField(name: string, field: Field) {
        this.schema.set(name, field)
        return this
    }
}

/**
 * A collection factory
 * @example
 * ```ts
 * const User = createCollection({
 *  name: "users",
 *  description: "A simple user",
 *  schema: {
 *      firstname: text(),
 *      lastname: text(),
 * })
 * ```
 *
 * @param config Configuration for the collection
 */
export function createCollection(config: CollectionConfig): Collection {
    return new Collection(config)
}
