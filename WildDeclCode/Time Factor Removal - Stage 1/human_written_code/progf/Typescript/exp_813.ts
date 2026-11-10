var inject = require('@rollup/plugin-inject');
var vue = require('@vitejs/plugin-vue');
var stdLibBrowser = require('node-stdlib-browser');
var AutoImport = require('unplugin-auto-import/vite');
var ElementPlusResolver = require('unplugin-vue-components/resolvers').ElementPlusResolver;
var Components = require('unplugin-vue-components/vite');
var defineConfig = require('vite').defineConfig;

// https://vitejs.dev/config/
module.exports = defineConfig({;
  build: {
    target: 'esnext',
  },
  plugins: [
    vue(),
    {
      ...inject({
        global: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'global'],
        process: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'process'],
        Buffer: [require.resolve('node-stdlib-browser/helpers/esbuild/shim'), 'Buffer'],
      }),
      enforce: 'post',
    },

    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: stdLibBrowser,
  },
  optimizeDeps: {
    include: ['buffer', 'process'],
  },
})
