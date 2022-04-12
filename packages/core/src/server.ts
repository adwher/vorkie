import polka from "polka"
import http from "http"

import { json as jsonMiddleware } from "body-parser"

export type Request = http.IncomingMessage & {
    originalUrl?: string
    query?: Record<string, unknown>
    params: Record<string, string>
}

export type Response = http.ServerResponse & {}

export type Server = polka.Polka
export type Middleware = (req: Request, res: Response, next: polka.Next) => void

export interface ServerConfig {
    host?: string
    port?: number

    bodyLimit?: `${number}${"b" | "kb" | "mb" | "gb"}`
}

export function createServer(config: ServerConfig): Server {
    const server = polka()

    server.use(
        jsonMiddleware({
            limit: config.bodyLimit,
        })
    )

    server.get("/_ping", ping())

    return server
}

export async function startServer(server: Server, config: ServerConfig) {
    server.listen(config.port, config.host)
}

function ping(): Middleware {
    return async (req, res) => {
        res.setHeader("X-Powered-By", "Vormik")
        res.end("_pong")
    }
}
