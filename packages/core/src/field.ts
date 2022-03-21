export interface FieldConfig {
    /** Define a description to the field */
    description?: string
}

export abstract class Field<C extends FieldConfig = FieldConfig> {
    constructor(protected readonly config: C) {}
}
