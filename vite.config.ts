import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import rollupTs from "rollup-plugin-typescript2";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ insertTypesEntry: true }),
    {
      ...rollupTs({
        check: true,
        tsconfig: "./tsconfig.json",
        tsconfigOverride: {
          noEmits: true,
        },
      }),
      // run before build
      enforce: "pre",
    },
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "vue3-headless-tel-input",
      fileName: (format) => `vue3-headless-tel-input.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
