var path = require('path');

var defineConfig = require('vite').defineConfig;
var vue = require('@vitejs/plugin-vue');

var Icons = require('unplugin-icons/vite');
var IconsResolver = require('unplugin-icons/resolver');
var Components = require('unplugin-vue-components/vite');

var WindiCSS = require('vite-plugin-windicss');
var VitePWA = require('vite-plugin-pwa').VitePWA;
var pkg = require('../package.json');

// https://vitejs.dev/config/
module.exports = defineConfig({;
  base: "/" + (pkg.name) + "/",
  plugins: [
    vue(),

    // https://github.com/antfu/unplugin-icons
    Icons(),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ['vue', 'md'],

      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],

      // custom resolvers
      resolvers: [
        // auto import icons
        // https://github.com/antfu/unplugin-icons
        IconsResolver({
          // componentPrefix: "",
          // enabledCollections: ['carbon']
        }),
      ],

      dts: 'src/components.d.ts',
    }),

    WindiCSS(),

    VitePWA({
      manifest: {
        icons: [
          {
            src: '/img/icons/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/img/icons/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '~/': "" + (path.resolve(__dirname, 'src')) + "/",
      'char-dust': path.resolve(__dirname, '../src/index.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['canvas'],
  },
})
