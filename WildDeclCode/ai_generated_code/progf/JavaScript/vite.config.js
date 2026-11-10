import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Aided with basic GitHub coding tools
      "@": path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "./src"
      ),
    },
  },
});
