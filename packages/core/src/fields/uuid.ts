import { Field, FieldConfig } from "$/field"
import { createID } from "$/utils/crypto"
import { merge } from "lodash"

interface UUIDFieldConfig extends FieldConfig {}

export class UUIDField extends Field<UUIDFieldConfig> {
    constructor(config: UUIDFieldConfig) {
        super(config)
    }

    beforeChange(value?: unknown): unknown {
        return value ?? createID()
    }
}

/** Defines a auto-generated UUID field */
export function uuid(config?: UUIDFieldConfig) {
    const fallback: UUIDFieldConfig = {}
    return new UUIDField(merge(fallback, config))
}
