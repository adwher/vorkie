import { Field, FieldDataError, FieldConfig } from "../field"

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

    validate(value: unknown) {
        if (value === undefined) return

        if (typeof value !== "string") {
            return new FieldDataError({
                code: "invalid_type",
                message: `Expected string, received ${typeof value}`,
            })
        }

        if (this.config.min && value.length < this.config.min) {
            return new FieldDataError({
                code: "too_small",
                message: `String must contain at least ${this.config.min} character(s)`,
            })
        }

        if (this.config.max && value.length > this.config.max) {
            return new FieldDataError({
                code: "too_bing",
                message: `String must contain least than ${this.config.max} character(s)`,
            })
        }
    }

    beforeCreate(value: unknown): unknown {
        return value
    }

    beforeUpdate(value: unknown): unknown {
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
