import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/frp/',
  plugins: [react()],
  server: {
    port: 5173,
    open: false,
    watch: {
      usePolling: true
    }
  }
})
