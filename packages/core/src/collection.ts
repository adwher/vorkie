import { Field, FieldConfig, FieldDataError } from "./field"
import { RawData } from "./database"

type Schema = Map<string, Field<FieldConfig>>

interface CollectionConfig {
    name: string
    description?: string
    identifier: string
    schema: Schema
    private?: boolean
}

export class CollectionDataError {
    constructor(public issues: FieldDataError[]) {}
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

    /** @returns Collection's config. */
    public getConfig() {
        return this.config
    }

    /**
     * Verifies that the data is valid according to the collection schema.
     * @returns `undefined` if the data is valid, otherwise returns an detailed error.
     */
    public validate(data: RawData) {
        const errors: FieldDataError[] = []

        for (const [name, field] of this.schema) {
            const error = field.validate(data[name])

            if (error instanceof FieldDataError) {
                error.path.push(name)
                errors.push(error)
            }
        }

        if (errors.length > 0) {
            return new CollectionDataError(errors)
        }
    }

    /**
     * Runs before the data is created within an `insert` operation.
     * @returns The data to be saved.
     */
    public beforeCreate(data: RawData) {
        for (const [name, field] of this.schema) {
            data[name] = field.beforeCreate(data[name])
        }

        return data
    }

    /**
     * Runs before the value is changed within an `update` operation.
     * Also merge the new data with the existing data.
     * @returns The data to be saved.
     */
    public beforeUpdate(newest: RawData, oldest: RawData) {
        for (const [name, field] of this.schema) {
            newest[name] = field.beforeUpdate(newest[name], oldest[name])
        }

        return newest
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
