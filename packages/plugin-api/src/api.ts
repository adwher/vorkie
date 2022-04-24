import { App, Middleware } from "vormik"

import { handleCreate } from "./basics/create"
import { handleList, handleFindByID } from "./basics/read"
import { handleRemoveByID } from "./basics/remove"
import { handleUpdateByID } from "./basics/update"

export function createRouter(app: App): Middleware {
    return async (req, res, next) => {
        const id = req.params.id
        const name = req.params.collection
        const collection = app.collections.get(name)

        if (!collection) return next()

        const context = { app, collection, id }

        // GET /{collection}

        if (req.method === "GET" && !id) {
            return handleList(req, res, context)
        }

        // GET /{collection}/{id}

        if (req.method === "GET" && id) {
            return handleFindByID(req, res, context)
        }

        // POST /{collection}

        if (req.method === "POST" && !id) {
            return handleCreate(req, res, context)
        }

        // PUT /{collection}/{id}

        if (req.method === "PUT" && id) {
            return handleUpdateByID(req, res, context)
        }

        // DELETE /{collection}/{id}

        if (req.method === "DELETE" && id) {
            return handleRemoveByID(req, res, context)
        }
    }
}
