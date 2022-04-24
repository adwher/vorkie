import { App, Collection, Request, Response } from "vormik"

export async function handleRemoveByID(
    req: Request,
    res: Response,
    context: { app: App; collection: Collection; id: unknown }
) {
    try {
        const database = context.app.database
        const collection = context.collection
        const name = context.collection.name

        const config = collection.getConfig()

        const exist = await database
            .from(name)
            .where(config.identifier, "==", context.id)
            .single()

        if (!exist) {
            res.status(404)
            res.end()
            return
        }

        const [data] = await database
            .from(name)
            .where(config.identifier, "==", context.id)
            .remove()

        res.status(204)
        res.send(data)
    } catch (err) {
        res.status(500)
        res.send({
            message: "server_error",
            details: err,
        })
    }
}
