import { Field, FieldConfig } from "$/field"
import { createIdentifierBySize } from "$/utils/crypto"
import { merge } from "lodash"

interface IdentifierFieldConfig extends FieldConfig {}

export class IdentifierField extends Field<IdentifierFieldConfig> {
    constructor(config: IdentifierFieldConfig) {
        super(config)
    }

    beforeCreate() {
        return createIdentifierBySize(21)
    }

    beforeUpdate(value?: unknown) {
        if (value) throw new Error("An id cannot be updated")
    }
}

/**
 * Defines a auto-generated ID field.
 * When collection data is insert, the field value will be set using a cryptographically secure random text generator.
 */
export function id(config?: IdentifierFieldConfig) {
    const fallback: IdentifierFieldConfig = {}
    return new IdentifierField(merge(fallback, config))
}
