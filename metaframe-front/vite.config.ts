import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Heavy libraries are split so the initial shell bundle stays closer to IDE-shell use cases.
        manualChunks: {
          monaco: ['@monaco-editor/react'],
          antd: ['antd', '@ant-design/icons'],
        },
      },
    },
  },
})
