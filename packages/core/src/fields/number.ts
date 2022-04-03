import { Field, FieldConfig } from "$/field"

interface NumberFieldConfig extends FieldConfig {
    /** The minimum value allowed for this field. */
    min?: number

    /** The maximum value allowed for this field. */
    max?: number
}

export class NumberField extends Field<NumberFieldConfig> {
    constructor(config: NumberFieldConfig) {
        super(config)
    }

    beforeValidate(value?: unknown): unknown {
        if (value === undefined) return value

        if (typeof value !== "number") {
            return new Error("An number field must be a number")
        }

        if (this.config.min && value < this.config.min) {
            return new Error(
                `Number '${value}' must be greater than ${this.config.min}`
            )
        }

        if (this.config.max && value > this.config.max) {
            return new Error(
                `Number '${value}' must be less than ${this.config.max}`
            )
        }
    }

    beforeCreate(value?: unknown): unknown {
        return value
    }

    beforeUpdate(value?: unknown): unknown {
        return value
    }
}

/** Defines a number-based field */
export function number(config?: NumberFieldConfig) {
    const fallback: NumberFieldConfig = {
        ...config,
    }

    return new NumberField(fallback)
}
