import {defineConfig} from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist",
    splitting: true,
    treeshake: true,
    sourcemap: true,
    minify: true,
    clean: true,
});