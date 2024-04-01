import { build } from "esbuild";

const name = "Build time";

console.log("Starting esbuild");
console.time(name);

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

console.timeEnd(name);
console.log(`Finished building with ${result.errors.length} errors and ${result.warnings.length} warnings\n`);
