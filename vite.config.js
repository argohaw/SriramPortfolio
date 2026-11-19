import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // The site is served from /SriramPortfolio/ (e.g. GitHub Pages project site).
  // Files in public/ must be referenced through asset() in src/lib/asset.js so they get this prefix.
  base: '/SriramPortfolio/',
  plugins: [react(), tailwindcss()],
})
