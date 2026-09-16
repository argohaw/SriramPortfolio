import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/SriramPortfolio/',
  assetsInclude: ['**/*.avif'],
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          three: ['three', '@react-three/fiber'],
          icons: ['react-icons']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})

