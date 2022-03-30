export interface FieldConfig {
    /** Define a description to the field */
    description?: string
}

export abstract class Field<C extends FieldConfig> {
    constructor(protected readonly config: C) {}

    /**
     * Runs before the value is changed within an `update` operation.
     * At this stage, you can be confident that the data that will be saved to the document is valid in accordance to your field validations.
     *
     * You can optionally modify the shape of data to be saved or `throw` an error if the data is invalid.
     */
    abstract beforeChange(value?: unknown): unknown
}
