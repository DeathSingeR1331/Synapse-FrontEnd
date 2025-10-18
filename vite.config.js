// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 4173,
    base: process.env.VITE_BASE_URL || '/Synapse-FrontEnd'
    // Note: Proxy removed for Vercel deployment compatibility
    // API calls now use environment variables (VITE_API_BASE_URL)
  },
})