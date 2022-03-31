import { green, red, blue, yellow, gray } from "colorette"

export enum LoggerLevel {
    SILENT,
    ERROR,
    WARNING,
    INFO,
}

export interface LoggerConfig {
    thresh: LoggerLevel
}

export class Logger {
    protected thresh: LoggerLevel

    constructor(protected config: LoggerConfig) {
        this.thresh = config.thresh
    }

    public info(message: string) {
        if (this.thresh >= LoggerLevel.INFO) {
            console.log(blue("info") + ` ${message}`)
        }
    }

    public success(message: string) {
        if (this.thresh >= LoggerLevel.INFO) {
            console.log(green("success") + ` ${message}`)
        }
    }

    public warning(message: string) {
        if (this.thresh >= LoggerLevel.WARNING) {
            console.warn(yellow("warn") + ` ${message}`)
        }
    }

    public error(payload?: unknown) {
        const message = payload instanceof Error ? payload.message : payload

        if (this.thresh >= LoggerLevel.ERROR) {
            console.error(red("error") + ` ${message}`)

            if (payload instanceof Error) {
                console.log()
                console.log(gray(payload.stack as string))
                console.log()
            }
        }
    }
}

interface CreateLoggerConfig {
    thresh: LoggerLevel
}

export function createLogger(config: CreateLoggerConfig) {
    return new Logger(config)
}
