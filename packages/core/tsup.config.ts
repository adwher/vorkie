import { defineConfig } from "tsup"

import alias from "esbuild-plugin-alias"
import path from "path"

export default defineConfig(options => {
    return {
        entry: ["./src/index.ts"],
        clean: true,
        dts: true,
        minify: !options.watch,
        esbuildPlugins: [
            alias({
                $: path.resolve(__dirname, "./src/"),
            }),
        ],
    }
})
