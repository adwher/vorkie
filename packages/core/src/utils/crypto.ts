import { customAlphabet } from "nanoid"

/**
 * Generates a URL-friendly and anti-collision ID with 24 random characters.
 * @example `T219EDPAC84FJ991C6DNP11E`
 */
export function createFriendlyID() {
    const alphabet = "123456789ABCDEFGHJKLMNOPQRSTWXYZ"
    const generate = customAlphabet(alphabet)

    return generate(24)
}
