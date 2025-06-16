import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'providers/index': 'src/providers/index.ts'
  },
  sourcemap: true,
  outDir: "dist",
  clean: true,
  format: ["esm", "cjs"],
  dts: {
    resolve: true,
    entry: ['src/index.ts', 'src/providers/index.ts']
  },
  splitting: true,
});
