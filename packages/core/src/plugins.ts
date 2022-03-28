import { AppConfig } from "$/app"

export interface Plugin {
    beforeCreated(config: AppConfig): AppConfig

    beforeMount?(): Promise<void>
    beforeUnmount?(): Promise<void>
}
