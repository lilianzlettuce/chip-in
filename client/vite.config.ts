/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})*/

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_PORT': JSON.stringify(env.REACT_APP_PORT),
      'process.env.REACT_APP_SERVER_URL': JSON.stringify(env.REACT_APP_SERVER_URL)
    },
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/auth": {
          target: "http://localhost:5173/",
          changeOrigin: true,
          //rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
  }
})