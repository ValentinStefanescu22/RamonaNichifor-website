import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const page = (name: string) => resolve(import.meta.dirname, `${name}.html`);

export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        index: page("index"),
        universuri: page("universuri"),
        carti: page("carti"),
        carte: page("carte"),
        despre: page("despre"),
        arta: page("arta"),
        consiliere: page("consiliere"),
        comunitate: page("comunitate"),
        contact: page("contact"),
        produs: page("produs"),
      },
    },
  },
});
