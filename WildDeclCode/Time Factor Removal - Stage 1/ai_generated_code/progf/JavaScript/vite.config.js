var defineConfig = require('vite').defineConfig;
var path = require('path');
var react = require('@vitejs/plugin-react');

// https://vite.dev/config/
module.exports = defineConfig({;
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
