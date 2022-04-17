import { Field, FieldConfig } from "../field"

interface TimestampFieldConfig extends FieldConfig {
    createdOnly?: boolean
}

export class TimestampField extends Field<TimestampFieldConfig> {
    constructor(config: TimestampFieldConfig) {
        super(config)
    }

    validate(value: unknown) {
        return undefined
    }

    beforeCreate(): unknown {
        return new Date().toISOString()
    }

    beforeUpdate(newest: unknown, oldest: unknown): unknown {
        if (this.config.createdOnly) return oldest
        else return new Date().toISOString()
    }
}

/**
 * Defines a auto-generated timestamp field.
 * When collection data change on `insert` or `update` operations the field value will be set to the current timestamp at ISO8601 format.
 */
export function timestamp(config?: TimestampFieldConfig) {
    const fallback: TimestampFieldConfig = {
        ...config,
    }

    return new TimestampField(fallback)
}
