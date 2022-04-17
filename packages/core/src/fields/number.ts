import { Field, FieldConfig, FieldDataError } from "../field"

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

    validate(value: unknown) {
        if (value === undefined) return

        if (typeof value !== "number") {
            return new FieldDataError({
                code: "invalid_type",
                message: `Expected number, received ${typeof value}`,
            })
        }

        if (this.config.min && value < this.config.min) {
            return new FieldDataError({
                code: "too_small",
                message: `Number must be greater than ${this.config.min}`,
            })
        }

        if (this.config.max && value > this.config.max) {
            return new FieldDataError({
                code: "too_big",
                message: `Number must be less than ${this.config.max}`,
            })
        }
    }

    beforeCreate(value: unknown): unknown {
        return value
    }

    beforeUpdate(newest: unknown): unknown {
        return newest
    }
}

/** Defines a number-based field */
export function number(config?: NumberFieldConfig) {
    const fallback: NumberFieldConfig = {
        ...config,
    }

    return new NumberField(fallback)
}
