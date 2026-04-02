import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
      },
      manifest: {
        name: 'ManaCredit',
        short_name: 'ManaCredit',
        description: 'Ultra-fast POS for TCG & Comic shops',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        background_color: '#0B0C10',
        theme_color: '#8B5CF6',
        categories: ['productivity', 'business'],
        screenshots: [
          {
            src: '/screenshot-192.png',
            sizes: '192x192',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '/screenshot-512.png',
            sizes: '512x512',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
