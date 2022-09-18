// SPDX-FileCopyrightText: 2022 Ethaks <ethaks@pm.me>
//
// SPDX-License-Identifier: MIT

import path from "node:path";
import url from "node:url";

import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import { copy } from "@guanghechen/rollup-plugin-copy";
import { terser } from "rollup-plugin-terser";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
/**
 * Returns an absolute path
 *
 * @param {string} relativePath - A path relative to the project root
 * @returns {string} An absolute path
 */
function resolve(relativePath) {
  return path.resolve(__dirname, relativePath);
}

const COPY_FILES = ["LICENSE", "CHANGELOG.md"];

const config = defineConfig(() => {
  return {
    root: "src/",
    base: "/modules/metron/",
    publicDir: resolve("public"),
    server: {
      port: 30001,
      open: false,
      proxy: {
        [`^(?!/modules/metron)`]: "http://localhost:30000/",
        ["/socket.io/"]: {
          target: "ws://localhost:30000",
          ws: true,
        },
      },
    },
    esbuild: {
      minifySyntax: true,
      minifyWhitespace: true,
    },
    build: {
      target: "es2022",
      outDir: resolve("dist"),
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        output: {
          sourcemapPathTransform: (relative) => {
            // Relative paths start with a `../`, which moves the path out of the `modules/metron1` directory.
            if (relative.startsWith("../")) relative = relative.replace("../", "");
            return relative;
          },
        },
        plugins: [terser({ mangle: { keep_classnames: true, keep_fnames: true } })],
      },
      reportCompressedSize: true,
      lib: {
        name: "metron",
        entry: resolve("src/module/metron.mjs"),
        formats: ["es"],
        fileName: () => "metron.js",
      },
    },
    css: {
      devSourcemap: true,
    },
    test: {
      dir: resolve("spec"),
      include: [resolve("spec") + "/**/*.{test,spec}.{js,mjs}"],
      setupFiles: [resolve("spec/setup.mjs")],
    },
    plugins: [
      visualizer({
        sourcemap: true,
        template: "treemap",
      }),
      copy({ targets: [{ src: COPY_FILES, dest: resolve("dist") }], hook: "writeBundle" }),
    ],
  };
});

export default config;
