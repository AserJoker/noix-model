import { defineConfig } from "vite";
export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "umd"],
      fileName: "noix-model",
      name: "noix-model",
    },
    minify: true,
  },
});
