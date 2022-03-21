import polka from "polka"
import bodyParser from "body-parser"

export type Server = polka.Polka

export type Middleware = polka.Middleware

export interface ServerConfig {
    host?: string
    port?: number

    bodyLimit?: `${number}${"b" | "kb" | "mb" | "gb" | "tb"}`
}

export function createServer(config: ServerConfig): Server {
    const server = polka()

    server.use(bodyParser.json({ limit: "10mb" }))
    server.use(bodyParser.urlencoded())

    server.get("/_ping", pong())

    return server
}

export function startServer(server: Server, config: ServerConfig) {
    server.listen(config.port, config.host)
}

function pong(): Middleware {
    return async (req, res) => {
        res.end("_pong")
    }
}
