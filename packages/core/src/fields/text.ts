import { Field, FieldConfig } from "$/field"
import { merge } from "lodash"

interface TextFieldConfig extends FieldConfig {
    /** Sets the max text length */
    maxLength?: number

    /** Sets the min text length */
    minLength?: number
}

export class TextField extends Field<TextFieldConfig> {
    constructor(config: TextFieldConfig) {
        super(config)
    }
}

/** Defines a text-based field */
export function text(config?: TextFieldConfig) {
    const fallback: TextFieldConfig = {}
    return new TextField(merge(fallback, config))
}
