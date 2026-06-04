import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.v3.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Flavohub',
        short_name: 'Flavohub',
        description: 'Flavohub | Fast & Fresh Food Delivery',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    }),
    sentryVitePlugin({
      org: "flavohub",      // Replace with your Sentry organization
      project: "frontend",  // Replace with your Sentry project name
      // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
      // and should ideally be passed in your CI environment as SENTRY_AUTH_TOKEN
      authToken: process.env.SENTRY_AUTH_TOKEN,
    })
  ],
  build: {
    sourcemap: true, // Required for Sentry to get unminified stack traces
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Permissions-Policy': 'accelerometer=*, gyroscope=*, magnetometer=*',
    },
  },
})
