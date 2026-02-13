import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@motions/react': path.resolve(__dirname, '../packages/react/src/index.ts'),
      '@motions/dom': path.resolve(__dirname, '../packages/dom/src/index.ts'),
      '@motions/core': path.resolve(__dirname, '../packages/core/src/index.ts'),
    },
  },
})
