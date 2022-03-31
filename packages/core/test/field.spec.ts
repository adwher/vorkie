import { describe, expect, it } from "vitest"

import { text, TextField, id, IdentifierField } from "../dist/index"

describe("Text", () => {
    it("text()", () => {
        expect(typeof text).toBe("function")
    })

    it("new TextField()", () => {
        expect(typeof TextField).toBe("function")
    })

    it("text() creates TextField()", () => {
        expect(text() instanceof TextField).toBe(true)
    })
})

describe("Identifier", () => {
    it("id()", () => {
        expect(typeof id).toBe("function")
    })

    it("new IdentifierField()", () => {
        expect(typeof IdentifierField).toBe("function")
    })

    it("id() creates IdentifierField()", () => {
        expect(id() instanceof IdentifierField).toBe(true)
    })
})
