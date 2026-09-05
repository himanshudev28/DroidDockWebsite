import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` matters for GitHub Pages project sites (user.github.io/<repo>/).
// Build with BASE_PATH=/MacDroid/ for that; the default suits a custom
// domain, Netlify, Vercel or Cloudflare Pages.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    cssMinify: 'lightningcss',
    rollupOptions: {
      // A plain multi-page build: real URLs, no client-side router, works
      // on any static host without a rewrite rule.
      input: {
        main: resolve(__dirname, 'index.html'),
        docs: resolve(__dirname, 'docs/index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html'),
        notFound: resolve(__dirname, '404.html'),
      },
    },
  },
})
