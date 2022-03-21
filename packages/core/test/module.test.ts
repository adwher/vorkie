import { describe, expect, it } from "vitest"
import { createApp, App } from "../dist/index"

describe("Module definition", () => {
    it("Function 'createApp' is defined", () => {
        expect(typeof createApp).toBe("function")
    })

    it("Class 'App' is defined", () => {
        expect(typeof App).toBe("function")
    })
})
