// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import viteMdxEscape from './plugins/vite-mdx-escape.mjs';

export default defineConfig({
  site: 'https://knowledgeatlas.app',
  output: 'static',
  trailingSlash: 'ignore',
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkGfm],
      syntaxHighlight: 'shiki',
      shikiConfig: {
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        wrap: true,
      },
      gfm: true,
    }),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkGfm],
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },
  vite: {
    plugins: [viteMdxEscape()],
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.astro', '.mdx', '.md'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@lib': fileURLToPath(new URL('./src/lib', import.meta.url)),
        '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      },
    },
    ssr: {
      noExternal: ['@knowledgeatlas/schemas'],
    },
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
