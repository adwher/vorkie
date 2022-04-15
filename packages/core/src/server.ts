import { IncomingMessage, ServerResponse } from "http"
import { json as jsonMiddleware } from "body-parser"

import polka from "polka"

/** An {@link IncomingMessage} extension. */
export type Request = IncomingMessage & {
    /** The originally-requested URL, including parent router segments. */
    originalUrl: string

    /** The parsed query string. */
    query: Record<string, unknown>

    /** The unparsed query string from URL. */
    search?: string

    /** The values of named parameters within your route pattern. */
    params: Record<string, string>

    /** The parse request body. */
    body: Record<string, unknown>
}

/** It is passed as the second parameter to the `request` event and allows to send a HTTP response. */
export type Response = ServerResponse & {}

/** Calls the next middleware function in the chain, or throws an error. */
export type FnNext = (err?: string | Error) => void

/** An simple server middleware. */
export type Middleware = (req: Request, res: Response, next: FnNext) => void

export type Server = polka.Polka

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
