import { expect, it, describe } from "vitest"
import { mapper, createFriendlyID } from "../src/utils"

describe("mapper()", () => {
    const data = [{ name: "Jhon" }, { name: "Doe" }]
    const key = "name"

    it("should return a Map()", () => {
        const map = mapper(data, key)

        expect(map).toBeInstanceOf(Map)
        expect(map.size).toBe(2)
    })

    it("should return a Map() with the correct key", () => {
        const map = mapper(data, key)

        expect(map.get("Jhon")).toBe(data[0])
        expect(map.get("Doe")).toBe(data[1])
        expect(map.get("Angel")).toBe(undefined)
    })
})

describe("createFriendlyID", () => {
    it("should return a string", () => {
        const id = createFriendlyID()
        expect(typeof id).toBe("string")
    })

    it("should return a string with 22 characters", () => {
        const id = createFriendlyID()
        expect(id.length).toBe(22)
    })

    it("should return a string with only numbers and letters", () => {
        const id = createFriendlyID()
        expect(id.match(/^[a-z0-9]+$/i)).toBeTruthy()
    })
})
