import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  sourcemap: true,
  outDir: "dist",
  clean: true,
  format: "esm",
  dts: true,
});
