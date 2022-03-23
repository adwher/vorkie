import { describe, expect, it } from "vitest"

import {
    createApp,
    App,
    createCollection,
    Collection,
    text,
    TextField,
} from "../dist/index"

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

describe("Fields", () => {
    describe("Text", () => {
        it("text()", () => {
            expect(typeof text).toBe("function")
        })

        it("new TextField()", () => {
            expect(typeof TextField).toBe("function")
        })
    })
})
