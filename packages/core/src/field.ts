export interface FieldConfig {
    /** Define a description to the field */
    description?: string
}

export abstract class Field<C extends FieldConfig> {
    constructor(protected readonly config: C) {}

    /**
     * Runs before the data is created within an `insert` operation.
     * At this stage, you can be confident that the data that will be saved to the document is valid in accordance to your field validations.
     *
     * You can optionally modify the shape of data to be saved or `throw` an error if the data is invalid.
     * @throws {@link Error} if the data is invalid
     */
    abstract beforeCreate(value?: unknown): unknown

    /**
     * Runs before the value is changed within an `update` operation.
     * At this stage, you can be confident that the data that will be saved to the document is valid in accordance to your field validations.
     *
     * You can optionally modify the shape of data to be saved or `throw` an error if the data is invalid.
     * @throws {@link Error} if the data is invalid
     */
    abstract beforeUpdate(value?: unknown): unknown
}
