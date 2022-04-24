import { App, Collection, Request, Response } from "vorkie"

export async function handleList(
    req: Request,
    res: Response,
    context: { app: App; collection: Collection }
) {
    try {
        const database = context.app.database
        const name = context.collection.name

        const data = await database.from(name).list()
        res.send(data)
    } catch (err) {
        res.status(500)
        res.send({
            message: "server_error",
            details: err,
        })
    }
}

export async function handleFindByID(
    req: Request,
    res: Response,
    context: { app: App; collection: Collection; id: unknown }
) {
    try {
        const database = context.app.database
        const collection = context.collection
        const name = context.collection.name

        const config = collection.getConfig()

        const data = await database
            .from(name)
            .where(config.identifier, "==", context.id)
            .single()

        if (!data) {
            res.status(404)
            res.end()
            return
        }

        res.send(data)
    } catch (err) {
        res.status(500)
        res.send({
            message: "server_error",
            details: err,
        })
    }
}
