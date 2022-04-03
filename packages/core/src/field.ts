export interface FieldConfig {
    /** Define a description to the field who could be exposed using {@link https://spec-md.com/#sec-Markdown markdown} syntax */
    description?: string
}

export abstract class Field<C extends FieldConfig> {
    constructor(protected readonly config: C) {}

    /**
     * Runs before operations for cheking that it conforms to certain rules.
     * You can optionally modify the shape of data to be saved or `throw` an error if the data is invalid.
     * @throws {@link Error} Data is invalid
     */
    abstract beforeValidate(value?: unknown): unknown

    /**
     * Immediately following validation, runs before the data is created within an `insert` operation.
     * You can optionally modify the shape of data to be saved, useful to auto-generated fields.
     */
    abstract beforeCreate(value?: unknown): unknown

    /**
     * Immediately following validation, runs before the value is changed within an `update` operation.
     * You can optionally modify the shape of data to be saved, useful to auto-generated fields.
     */
    abstract beforeUpdate(value?: unknown): unknown
}
