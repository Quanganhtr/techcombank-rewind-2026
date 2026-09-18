import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base must match the GitHub Pages sub-path: /<repo-name>/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/techcombank-rewind-2026/' : '/',
  plugins: [react(), tailwindcss()],
})
