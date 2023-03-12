import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

import path from 'path'

/** @type {import('vite').UserConfig} */
export default defineConfig({
  plugins: [svelte({}), tsconfigPaths()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js'
      },
      input: {
        index: path.resolve('./src/lib/index.ts')
      },
      plugins: []
    }
  }
})
