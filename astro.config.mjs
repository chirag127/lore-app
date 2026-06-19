// @ts-check

import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import remarkEscapeStrayLt from './src/lib/remarkEscapeStrayLt.mjs'
import remarkStripUnknownJsx from './src/lib/remarkStripUnknownJsx.mjs'

export default defineConfig({
  site: 'https://book-lore.oriz.in',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    react(),
    sitemap(),
    mdx({ remarkPlugins: [remarkEscapeStrayLt, remarkStripUnknownJsx] }),
  ],
  vite: { plugins: [tailwindcss()] },
})
