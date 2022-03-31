import { Field, FieldConfig } from "$/field"
import { createID } from "$/utils/crypto"
import { merge } from "lodash"

interface IdentifierFieldConfig extends FieldConfig {}

export class IdentifierField extends Field<IdentifierFieldConfig> {
    constructor(config: IdentifierFieldConfig) {
        super(config)
    }

    beforeCreate(value?: unknown): unknown {
        return value ?? createID()
    }

    beforeUpdate(value?: unknown): unknown {
        if (!value) return
        throw new Error("An uuid cannot be updated")
    }
}

/** Defines a auto-generated UUID field */
export function id(config?: IdentifierFieldConfig) {
    const fallback: IdentifierFieldConfig = {}
    return new IdentifierField(merge(fallback, config))
}
