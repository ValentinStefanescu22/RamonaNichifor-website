import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: resolve(import.meta.dirname, "index.html"),
        poiana: resolve(import.meta.dirname, "poiana.html"),
        jurnal: resolve(import.meta.dirname, "jurnal.html"),
        universuri: resolve(import.meta.dirname, "universuri.html"),
        universuriPoiana: resolve(import.meta.dirname, "universuri-poiana.html"),
      },
    },
  },
});
