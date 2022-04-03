import { Field, FieldConfig } from "$/field"
import { createIdentifierBySize } from "$/utils/crypto"

interface IdentifierFieldConfig extends FieldConfig {
    /**
     * The size of the identifier.
     */
    size: number
}

export class IdentifierField extends Field<IdentifierFieldConfig> {
    constructor(config: IdentifierFieldConfig) {
        super(config)
    }

    beforeValidate(value?: unknown): unknown {
        return value
    }

    beforeCreate() {
        return createIdentifierBySize(this.config.size)
    }

    beforeUpdate(value?: unknown) {
        if (value) throw new Error("An id cannot be updated")
    }
}

interface CreateIdentifierField {
    /**
     * The size of the identifier.
     * @default 12
     */
    size?: number
}

/**
 * Defines a auto-generated ID field.
 * When collection data is insert, the field value will be set using a cryptographically secure random text generator.
 */
export function id(config?: CreateIdentifierField) {
    const fallback: IdentifierFieldConfig = {
        size: config?.size ?? 12,
    }

    return new IdentifierField(fallback)
}
