import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const erpApi = env.VITE_API_PROXY || 'http://localhost:3000'
  const authSso = env.VITE_AUTH_SSO_PROXY || 'http://127.0.0.1:3006'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': {
          target: erpApi,
          changeOrigin: true,
        },
        '/auth-sso': {
          target: authSso,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth-sso/, ''),
        },
      },
    },
  }
})
