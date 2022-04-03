import { Field, FieldConfig } from "$/field"

interface TimestampFieldConfig extends FieldConfig {}

export class TimestampField extends Field<TimestampFieldConfig> {
    constructor(config: TimestampFieldConfig) {
        super(config)
    }

    beforeValidate(value?: unknown): unknown {
        return value
    }

    beforeCreate(): unknown {
        return new Date().toISOString()
    }

    beforeUpdate(): unknown {
        return new Date().toISOString()
    }
}

/**
 * Defines a auto-generated timestamp field.
 * When collection data change on `insert` and `update` operations the field value will be set to the current timestamp at UTC format.
 */
export function timestamp(config?: TimestampFieldConfig) {
    const fallback: TimestampFieldConfig = {
        ...config,
    }

    return new TimestampField(fallback)
}
