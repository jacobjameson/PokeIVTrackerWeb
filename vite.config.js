import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Set base to your GitHub repo name for GitHub Pages, e.g. '/pokeiv-tracker/'
  // Change this to match your repo: https://github.com/USERNAME/REPONAME
  base: '/PokeIVTrackerWeb/',
})
