import { nanoid } from "nanoid"

export function createIdentifierBySize(size = 21) {
    return nanoid(size)
}
