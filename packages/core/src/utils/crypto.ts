import { customAlphabet } from "nanoid"

/**
 * Generates a URL-friendly and anti-collision ID with 21 random characters.
 * @example `CNJBTJELS8AQ2CPR7P1WJ`
 */
export function createFriendlyID() {
    const alphabet = "123456789ABCDEFGHJKLMNOPQRSTWYZ"
    const generate = customAlphabet(alphabet)

    return generate(21)
}
