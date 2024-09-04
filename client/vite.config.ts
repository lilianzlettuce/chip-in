import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: { include:['App.js'] },
  build: {
    commonjsOptions: {
      include: ['react', 'react-is', 'react-router', 'react/jsx-runtime'],
    },
  }
})
