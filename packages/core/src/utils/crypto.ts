import { customAlphabet } from "nanoid"

export function createFriendlyID() {
    const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"
    const generator = customAlphabet(alphabet)

    return generator(26)
}
