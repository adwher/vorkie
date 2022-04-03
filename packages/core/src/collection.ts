import { Field, FieldConfig } from "$/field"
import { RawData } from "$/database"
import { entries } from "lodash"

interface CollectionConfig {
    /**
     * Plural collection name.
     *
     * @example
     * ```ts
     * const Users = new Collection({
     *      name: "users",
     *      // config...
     * })
     * ```
     */
    name: string

    /** Define a description to the collection. */
    description?: string

    /** Describe the fields used by the collection. */
    schema: Record<string, Field<FieldConfig>>

    /** Sets the collections as private and their use will be restricted to internal-only. */
    private?: boolean
}

export class Collection {
    public readonly name: string
    public readonly schema: Map<string, Field<FieldConfig>>

    constructor(protected readonly config: CollectionConfig) {
        this.name = config.name
        this.schema = new Map(entries(config.schema))
    }

    /** Creates a private {@link Collection} instance from their config. */
    public static from(config: CollectionConfig) {
        return new Collection({
            ...config,
            private: true,
        })
    }

    public isPrivate() {
        return this.config.private ?? false
    }

    /** Adds fields to the collections, useful to plugins and extensions. */
    public addField<C>(name: string, field: Field<C>) {
        this.schema.set(name, field)
        return this
    }

    /**
     * Runs before the data is created within an `insert` operation.
     * @throws {@link Error} if the data is invalid
     */
    beforeCreate(data: RawData) {
        const payload: RawData = { ...data }

        for (const [name, field] of this.schema) {
            payload[name] = field.beforeCreate(data[name])
        }

        return payload
    }

    /**
     * Runs before the value is changed within an `update` operation.
     * @throws {@link Error} if the data is invalid
     */
    beforeUpdate(data: RawData) {
        const payload: RawData = { ...data }

        for (const [name, field] of this.schema) {
            payload[name] = field.beforeUpdate(data[name])
        }

        return payload
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
