import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


//'https://work.hantzmichaelchery.com'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://work.hantzmichaelchery.com',
        changeOrigin: true,
      },
    },
  },
})