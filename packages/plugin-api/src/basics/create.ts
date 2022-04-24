import {
    App,
    Collection,
    CollectionDataError,
    RawData,
    Request,
    Response,
} from "vorkie"

export async function handleCreate(
    req: Request,
    res: Response,
    context: { app: App; collection: Collection }
) {
    try {
        const payload = req.body as RawData
        const database = context.app.database
        const name = context.collection.name

        const data = await database.from(name).insert(payload)

        res.status(201)
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
