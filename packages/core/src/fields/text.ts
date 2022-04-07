import { Field, FieldConfig } from "../field"

interface TextFieldConfig extends FieldConfig {
    /** The minimum length allowed for this field. */
    min?: number

    /** The maximum length allowed for this field. */
    max?: number
}

export class TextField extends Field<TextFieldConfig> {
    constructor(config: TextFieldConfig) {
        super(config)
    }

    beforeValidate(value?: unknown): unknown {
        if (value === undefined) return value

        if (typeof value !== "string") {
            throw new Error("An text field must be a string")
        }

        if (this.config.min && value.length < this.config.min) {
            throw new Error(
                `Length of '${value}' must be greater than ${this.config.min}`
            )
        }

        if (this.config.max && value.length > this.config.max) {
            throw new Error(
                `Length of '${value}' must be less than ${this.config.max}`
            )
        }

        return value
    }

    beforeCreate(value?: unknown): unknown {
        return value
    }

    beforeUpdate(value?: unknown): unknown {
        return value
    }
}

/** Defines a text-based field */
export function text(config?: TextFieldConfig) {
    const fallback: TextFieldConfig = {
        ...config,
    }

    return new TextField(fallback)
}
