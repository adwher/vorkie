export interface FieldConfig {
    /** Define a description to the field who could be exposed using {@link https://spec-md.com/#sec-Markdown markdown} syntax */
    description?: string
}

export class FieldDataError {
    public code: string
    public message: string
    public path: string[]

    constructor(config: { code: string; message: string }) {
        this.code = config.code
        this.message = config.message

        this.path = []
    }
}

export abstract class Field<C extends FieldConfig> {
    constructor(protected readonly config: C) {}

    /** Returns field config based on type of instance. */
    public getConfig() {
        return this.config
    }

    /**
     * Cheking that it conforms to certain rules.
     * Will be used by database instance at `insert` and `update` methods.
     */
    abstract validate(value: unknown): FieldDataError | undefined

    /**
     * Immediately following validation, runs before the data is created within an `insert` operation.
     * You can optionally modify the shape of data to be saved, useful to auto-generated fields.
     * @param newest - The value to be saved.
     */
    abstract beforeCreate(newest: unknown): unknown

    /**
     * Immediately following validation, runs before the value is changed within an `update` operation.
     * You can optionally modify the shape of data to be saved, useful to auto-generated fields.
     * @param newest - The new value of the field.
     * @param oldest - The old value of the field.
     */
    abstract beforeUpdate(newest: unknown, oldest: unknown): unknown
}
