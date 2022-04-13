import { Field, FieldConfig } from "../field"

interface CheckboxFieldConfig extends FieldConfig {}

export class CheckboxField extends Field<CheckboxFieldConfig> {
    constructor(config: CheckboxFieldConfig) {
        super(config)
    }

    beforeValidate(value?: unknown): unknown {
        return Boolean(value)
    }

    beforeCreate(value?: unknown): unknown {
        return Boolean(value)
    }

    beforeUpdate(value: unknown): unknown {
        return Boolean(value)
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
