import { describe, expect, it } from "vitest"

import {
    text,
    TextField,
    id,
    IdentifierField,
    timestamp,
    TimestampField,
    number,
    NumberField,
} from "../dist/index"

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

describe("Timestamp", () => {
    it("timestamp()", () => {
        expect(typeof timestamp).toBe("function")
    })

    it("new TimestampField()", () => {
        expect(typeof TimestampField).toBe("function")
    })

    it("timestamp() creates TimestampField()", () => {
        expect(timestamp() instanceof TimestampField).toBe(true)
    })
})

describe("Number", () => {
    it("number()", () => {
        expect(typeof number).toBe("function")
    })

    it("new NumberField()", () => {
        expect(typeof NumberField).toBe("function")
    })

    it("number() creates NumberField()", () => {
        expect(number() instanceof NumberField).toBe(true)
    })
})
