import { customAlphabet } from "nanoid"

export function createFriendlyID() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz1234567890"
    const generator = customAlphabet(alphabet)

    return generator(21)
}
