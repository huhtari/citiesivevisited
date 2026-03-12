import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Set VITE_BASE_URL env var to deploy to a subpath (e.g. /citiesvisited/ for GitHub Pages)
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL ?? '/',
})
