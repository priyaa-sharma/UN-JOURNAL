import { resolve } from "node:path";
import { defineConfig } from "vite";

const pages = ["index", "login", "journal", "entries", "affirmations", "vision"];

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: Object.fromEntries(
        pages.map((page) => [page, resolve(process.cwd(), `${page}.html`)]),
      ),
    },
  },
});
