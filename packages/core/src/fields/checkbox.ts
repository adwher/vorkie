import { Field, FieldConfig, FieldDataError } from "../field"

interface CheckboxFieldConfig extends FieldConfig {}

export class CheckboxField extends Field<CheckboxFieldConfig> {
    constructor(config: CheckboxFieldConfig) {
        super(config)
    }

    validate(value: unknown) {
        if (value === undefined) return

        if (typeof value !== "boolean") {
            return new FieldDataError({
                code: "invalid_type",
                message: `Expected boolean, received ${typeof value}`,
            })
        }
    }

    beforeCreate(value: unknown): unknown {
        return Boolean(value)
    }

    beforeUpdate(newest: unknown): unknown {
        return Boolean(newest)
    }
}

/**
 * Defines a `true` or `false` field.
 */
export function checkbox(config?: CheckboxFieldConfig) {
    const fallback: CheckboxFieldConfig = {
        ...config,
    }

    return new CheckboxField(fallback)
}
