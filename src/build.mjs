import { build } from "esbuild";

console.log("Starting esbuild");
console.time("Build time");
const result = await build({
    entryPoints: ["src/**/*.ts"],
    bundle: false,
    outdir: "dist",
    platform: "node",
    target: "node10.4",
    logLevel: "info",
    format: "cjs",
    minify: true,
    sourcemap: true
});
console.timeEnd("Build time");
console.log(`Finished building with ${result.errors.length} errors and ${result.warnings.length} warnings\n`);