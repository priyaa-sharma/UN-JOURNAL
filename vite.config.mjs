import { resolve } from "node:path";
import { readFile } from "node:fs/promises";
import { defineConfig } from "vite";

const pages = ["index", "login", "journal", "entries", "affirmations", "vision"];
const legacyScripts = [
  "script.js",
  "journal.js",
  "entries.js",
  "affirmations.js",
  "vision.js",
];

export default defineConfig({
  base: "./",
  plugins: [
    {
      name: "copy-legacy-page-scripts",
      apply: "build",
      async buildStart() {
        for (const file of legacyScripts) {
          this.emitFile({
            type: "asset",
            fileName: file,
            source: await readFile(resolve(process.cwd(), file), "utf8"),
          });
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(process.cwd(), `${page}.html`)]),
      ),
    },
  },
});
