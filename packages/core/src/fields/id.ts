import { Field, FieldConfig } from "$/field"
import { createFriendlyID } from "$/utils/crypto"

interface IdentifierFieldConfig extends FieldConfig {}

export class IdentifierField extends Field<IdentifierFieldConfig> {
    constructor(config: IdentifierFieldConfig) {
        super(config)
    }

    beforeValidate(value?: unknown): unknown {
        return value
    }

    beforeCreate() {
        return createFriendlyID()
    }

    beforeUpdate(value?: unknown) {
        if (value) throw new Error("An id cannot be updated")
    }
}

interface CreateIdentifierField {}

/**
 * Defines a auto-generated ID field.
 * When collection data is insert, the field value will be set using a cryptographically secure random text generator.
 */
export function id(config?: CreateIdentifierField) {
    const fallback: IdentifierFieldConfig = {
        ...config,
    }

    return new IdentifierField(fallback)
}
