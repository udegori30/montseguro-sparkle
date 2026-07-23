import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // GitHub Pages serve o projeto em /<repo>/, entao o build feito pela Action
  // de deploy precisa desse prefixo; local dev/build continuam em "/".
  base: process.env.GITHUB_ACTIONS ? "/montseguro-sparkle/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
  },
});
