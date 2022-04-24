import polka from "polka"

import { IncomingMessage, ServerResponse } from "http"
import { json, urlencoded } from "body-parser"

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

    /** The parsed body of the request. */
    body?: unknown
}

/** It is passed as the second parameter to the `request` event and allows to send a HTTP response. */
export type Response = ServerResponse & {
    /** Sets the status code and chain the response. */
    status(code: number): void

    /** Send a JSON response. */
    send(data: object): void
}

/**
 * Calls the next middleware function in the chain, or throws an error.
 * @param err The error to throw.
 */
export type FnNext = (err?: string | Error) => void

/**
 * An simple server middleware.
 * @param req The incoming request.
 * @param res The outgoing response.
 * @param next The next middleware function in the chain.
 */
export type Middleware = (req: Request, res: Response, next: FnNext) => void

export type Server = polka.Polka

export interface ServerConfig {
    host?: string
    port: number

    bodyLimit?: `${number}${"b" | "kb" | "mb" | "gb"}`
}

export function createServer(config: ServerConfig): Server {
    const server = polka()

    server.get("/_ping", ping())

    server.use(utils())
    server.use(json({ limit: config.bodyLimit }))
    server.use(urlencoded({ extended: true, limit: config.bodyLimit }))

    return server
}

export async function startServer(server: Server, config: ServerConfig) {
    server.listen(config.port, config.host)
}

function utils(): Middleware {
    return (req, res, next) => {
        res.send = (data: unknown) => {
            res.setHeader("x-powered-by", "vormik")
            res.setHeader("content-type", "application/json")

            return res.end(JSON.stringify(data))
        }

        res.status = (code: number) => {
            res.statusCode = code
        }

        next()
    }
}

function ping(): Middleware {
    return async (req, res) => {
        res.setHeader("x-powered-by", "vormik")
        res.end("_pong")
    }
}
