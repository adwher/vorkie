import {
    App,
    Collection,
    CollectionDataError,
    RawData,
    Request,
    Response,
} from "vormik"

export async function handleUpdateByID(
    req: Request,
    res: Response,
    context: { app: App; collection: Collection; id: unknown }
) {
    try {
        const database = context.app.database
        const collection = context.collection
        const name = context.collection.name

        const payload = req.body as RawData
        const config = collection.getConfig()

        const data = await database
            .from(name)
            .where(config.identifier, "==", context.id)
            .update(payload)

        res.status(200)
        res.send(data)
    } catch (err) {
        if (err instanceof CollectionDataError) {
            res.status(400)
            res.send({
                message: "invalid_data",
                details: err.issues,
            })

            return
        }

        res.status(500)
        res.send({
            message: "server_error",
            details: err,
        })
    }
}
