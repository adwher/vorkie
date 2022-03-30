import { nanoid } from "nanoid"

export function createID() {
    return nanoid(24)
}
