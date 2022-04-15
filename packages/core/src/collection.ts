import { Field, FieldConfig } from "./field"
import { RawData } from "./database"

type Schema = Map<string, Field<FieldConfig>>

interface CollectionConfig {
    name: string
    description?: string
    identifier: string
    schema: Schema
    private?: boolean
}

export class Collection {
    public readonly name: string
    public readonly schema: Schema

    constructor(protected readonly config: CollectionConfig) {
        this.name = config.name
        this.schema = config.schema
    }

    /** Adds fields to the collections, useful to plugins and extensions. */
    public addField<C>(name: string, field: Field<C>) {
        this.schema.set(name, field)
        return this
    }

    public getConfig() {
        return this.config
    }

    /**
     * Runs before the data is changed within an `insert` or `update` operation.
     * @throws {@link Error} Data is invalid
     */
    public beforeValidate(data: RawData) {
        const payload: RawData = { ...data }

        for (const [name, field] of this.schema) {
            payload[name] = field.beforeValidate(data[name])
        }

        return payload
    }

    /**
     * Runs before the data is created within an `insert` operation.
     * @throws {@link Error} Data is invalid
     */
    public beforeCreate(data: RawData) {
        const payload = this.beforeValidate(data)

        for (const [name, field] of this.schema) {
            payload[name] = field.beforeCreate(data[name])
        }

        return payload
    }

    /**
     * Runs before the value is changed within an `update` operation.
     * @throws {@link Error} Data is invalid
     */
    public beforeUpdate(data: RawData) {
        const payload = this.beforeValidate(data)

        for (const [name, field] of this.schema) {
            payload[name] = field.beforeUpdate(data[name])
        }

        return payload
    }
}

type CreateSchema = Record<string, Field<FieldConfig>>

interface CreateCollectionConfig<S extends CreateSchema> {
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

    /** Defines the unique field value who identify each document. */
    identifier: keyof S

    /** Describe the fields used by the collection. */
    schema: S
}

/**
 * A collection factory
 * @example
 * ```ts
 * const User = createCollection({
 *  name: "users",
 *  description: "A simple user",
 *  identifier: "id",
 *  schema: {
 *      id: id(),
 *      firstname: text(),
 *      lastname: text(),
 *  },
 * })
 * ```
 *
 * @param config Configuration for the collection
 */
export function createCollection<S extends CreateSchema>(
    config: CreateCollectionConfig<S>
) {
    const schema = new Map(Object.entries(config.schema))

    const fallback: CollectionConfig = {
        ...config,

        private: false,
        schema: schema,
        identifier: config.identifier as string,
    }

    return new Collection(fallback)
}
