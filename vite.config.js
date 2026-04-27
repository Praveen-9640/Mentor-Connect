import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.ngrok-free.dev'],
    proxy: {
      '/api': {
        target: 'https://mentor-connect-backend-qmg6.onrender.com',
        changeOrigin: true
      }
    }
  }
})