import { describe, expect, it } from "vitest"
import { createApp, App, createCollection, Collection } from "../dist"

describe("App", () => {
    it("createApp()", () => {
        expect(typeof createApp).toBe("function")
    })

    it("new App()", () => {
        expect(typeof App).toBe("function")
    })
})

describe("Collection", () => {
    it("createCollection()", () => {
        expect(typeof createCollection).toBe("function")
    })

    it("new Collection()", () => {
        expect(typeof Collection).toBe("function")
    })
})
