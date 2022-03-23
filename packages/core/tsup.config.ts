import { defineConfig } from "tsup"

import alias from "esbuild-plugin-alias"
import path from "path"

export default defineConfig(options => {
    return {
        entry: ["./src/index.ts"],
        minify: !options.watch,
        dts: true,

        esbuildPlugins: [
            alias({
                $: path.resolve(__dirname, "./src/"),
            }),
        ],
    }
})
