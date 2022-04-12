import { App, AppConfig } from "./app"

export interface Plugin {
    /** Sets a unique identifier for the plugin. */
    name: string

    /** Allows to describe what plugin do. */
    description?: string

    /** Defines a function that is executed before the application is created and can update its configuration. */
    beforeCreated?(config: AppConfig): AppConfig

    /** Defines a function that is executed before the application is mounted. */
    beforeMount?(app: App): Promise<void> | void

    /** Defines a function that is executed after the application will be unmount. */
    beforeUnmount?(app: App): Promise<void> | void
}
