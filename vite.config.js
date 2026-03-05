import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use root path locally; use repo sub-path for GitHub Pages production build
  base: command === 'serve' ? '/' : '/PokeIVTrackerWeb/',
}))
