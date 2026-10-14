import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/loid-arcane-packs-value/",
  server: {
    proxy: {
      "/api/wf": {
        target: "https://api.warframe.market",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/wf/, ""),
      },
    },
  },
});
