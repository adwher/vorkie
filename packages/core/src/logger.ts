import { green, red, cyan, yellow, gray, dim } from "colorette"

export enum LoggerLevel {
    SILENT,
    ERROR,
    WARNING,
    INFO,
    DEBUG,
}

export interface LoggerConfig {
    /**
     * Defines the threshold of logs in range `0-4`.
     * You can use {@link LoggerLevel} enum to define the threshold.
     */
    thresh: LoggerLevel
}

export class Logger {
    protected thresh: LoggerLevel

    constructor(protected config: LoggerConfig) {
        this.thresh = config.thresh
    }

    public debug(message: string) {
        if (this.thresh >= LoggerLevel.DEBUG) {
            console.log(gray("debug") + ` ${message}`)
        }
    }

    public info(message: string) {
        if (this.thresh >= LoggerLevel.INFO) {
            console.log(cyan("info") + ` ${message}`)
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
                console.log(dim(payload.stack as string))
                console.log()
            }
        }
    }
}

export function createLogger(config: LoggerConfig) {
    return new Logger(config)
}
