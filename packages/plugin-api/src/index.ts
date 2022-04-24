import { Plugin } from "vorkie"
import { createRouter } from "./api"

export function createAPI(): Plugin {
    return {
        name: "api",
        description:
            "Provides a endpoints to interact with collections via HTTP.",

        beforeMount(app) {
            app.at("/api/:collection/:id?", createRouter(app))
        },
    }
}
