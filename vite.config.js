import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico', 
        'apple-touch-icon.png', 
        'logo.svg',
        'icon-192.png',
        'icon-512.png',
        'icon-192-maskable.png',
        'icon-512-maskable.png'
      ],
      manifest: {
        name: 'Momentum',
        short_name: 'Momentum',
        description: 'Application de gestion de productivité et suivi de commits',
        theme_color: '#7BBDE8',
        background_color: '#0F1419',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['productivity', 'utilities'],
        lang: 'fr-FR',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-192-maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        // Cache des assets statiques
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        
        // Configuration du cache runtime
        runtimeCaching: [
          {
            // Cache API calls (NetworkFirst = réseau d'abord, cache en fallback)
            urlPattern: /^https:\/\/work\.hantzmichaelchery\.com\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            // Cache images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 jours
              }
            }
          }
        ],
        
        // Stratégie de navigation
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/]
      },
      
      // Options de dev
      devOptions: {
        enabled: false, // Désactiver PWA en dev pour éviter les problèmes
        type: 'module'
      }
    })
  ],
  
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // ✅ CORRIGÉ: Backend sur port 5000, pas 5173
        changeOrigin: true,
        secure: false,
        ws: true, // ✅ Support WebSocket pour Socket.IO
        rewrite: (path) => path // Garder /api dans le path
      },
      // ✅ NOUVEAU: Proxy pour Socket.IO
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    },
  },
  
  // Build config
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'socket-vendor': ['socket.io-client']
        }
      }
    }
  }
})