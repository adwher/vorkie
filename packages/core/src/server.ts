import polka from "polka"
import bodyParser from "body-parser"

export type Server = polka.Polka

export type Middleware = polka.Middleware

export interface ServerConfig {
    host?: string
    port?: number

    bodyLimit?: `${number}${"b" | "kb" | "mb" | "gb"}`
}

export function createServer(config: ServerConfig): Server {
    const server = polka()

    const json = bodyParser.json({ limit: config.bodyLimit ?? "10mb" })
    const urlencoded = bodyParser.urlencoded()

    server.use(urlencoded)
    server.use(json)

    server.get("/_ping", pong())

    return server
}

export function startServer(server: Server, config: ServerConfig) {
    server.listen(config.port, config.host)
}

function pong(): Middleware {
    return async (req, res) => {
        res.setHeader("X-Powered-By", "Vormik")
        res.end("_pong")
    }
}
