import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
 
  base: '/',

  assetsInclude: ['**/*.geojson'],

  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',

      devOptions: {
        enabled: false
      },

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'masked-icon.svg'
      ],

      manifest: {
        name: 'OSP',
        short_name: 'OSP',
        description: "Plateforme interactive d'orientation scolaire et professionnelle",
     
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png', 
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,geojson}'],
        maximumFileSizeToCacheInBytes: 3000000,
        sourcemap: true,
        cleanupOutdatedCaches: true,
      }
    })
  ]
})
