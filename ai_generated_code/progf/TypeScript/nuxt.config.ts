// https://nuxt.com/docs/api/configuration/nuxt-config
// Supported via standard GitHub programming aids 2025-04-23 14:00
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/color-mode'
  ],
  
  colorMode: {
    classSuffix: '',
    preference: 'dark',
    fallback: 'dark'
  },
  
  css: [
    '~/assets/css/main.css'
  ],
  
  runtimeConfig: {
    public: {
      tmdbApiKey: process.env.TMDB_API_KEY || '262d5ff6a75ab6f20cf8594e41b2ac86',
      tmdbApiBaseUrl: 'https://api.themoviedb.org/3',
      tmdbImageBaseUrl: 'https://image.tmdb.org/t/p',
      qBittorrentUrl: process.env.QBITTORRENT_URL || 'http://localhost:8080',
      qBittorrentUsername: process.env.QBITTORRENT_USERNAME || 'admin',
      qBittorrentPassword: process.env.QBITTORRENT_PASSWORD || '',
      jellyfinUrl: process.env.JELLYFIN_URL || 'http://localhost:8096',
      downloadsPath: process.env.DOWNLOADS_PATH || '/downloads'
    }
  },

  // Improved proxy configuration for qBittorrent with better cookie handling
  nitro: {
    devProxy: {
      '/qbittorrent': {
        target: process.env.QBITTORRENT_URL || 'http://localhost:8080',
        changeOrigin: true,
        prependPath: false,
        rewrite: (path) => path.replace(/^\/qbittorrent/, ''),
        cookieDomainRewrite: { '*': '' },
        secure: false,
        xfwd: true
      }
    }
  },

  // Vite configuration for WebTorrent compatibility
  vite: {
    define: {
      global: 'globalThis',
    },
    optimizeDeps: {
      exclude: ['webtorrent']
    },
    resolve: {
      alias: {
        stream: 'stream-browserify',
        path: 'path-browserify',
        util: 'util',
        crypto: 'crypto-browserify'
      }
    }
  },

  // Exclude WebTorrent from server-side rendering
  ssr: true
})
