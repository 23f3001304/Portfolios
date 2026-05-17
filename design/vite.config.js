import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize chunk splitting to reduce initial payload
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'gsap': ['gsap'],
          'lenis': ['lenis'],
          'three': ['three'],
        },
      },
    },
    // Target modern browsers for smaller output
    target: 'esnext',
    chunkSizeWarningLimit: 600,
  },
  server: {
    allowedHosts: [
      'herself-overnight-halves.ngrok-free.dev'
    ],
    port: 5173,
    open: false,
  },
})
