import { customAlphabet } from "nanoid"

/** Generates a URL-friendly ID with 22 random characters. */
export function createFriendlyID() {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    const generator = customAlphabet(alphabet)

    return generator(22)
}
