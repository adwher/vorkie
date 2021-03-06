import { Field, FieldConfig } from "../field"
import { createFriendlyID } from "../utils"

interface IdentifierFieldConfig extends FieldConfig {}

export class IdentifierField extends Field<IdentifierFieldConfig> {
    constructor(config: IdentifierFieldConfig) {
        super(config)
    }

    validate(value: unknown) {
        return undefined
    }

    beforeCreate() {
        return createFriendlyID()
    }

    beforeUpdate(newest: unknown, oldest: unknown) {
        return oldest
    }
}

interface CreateIdentifierField {}

/**
 * Defines a auto-generated ID field.
 * When document will be inserted, the field value will be set using a anti-collision random text generator.
 */
export function id(config?: CreateIdentifierField) {
    const fallback: IdentifierFieldConfig = {
        ...config,
    }

    return new IdentifierField(fallback)
}
