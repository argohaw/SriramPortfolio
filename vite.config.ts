import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three'],
          gsap: ['gsap'],
          lenis: ['lenis'],
          icons: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
