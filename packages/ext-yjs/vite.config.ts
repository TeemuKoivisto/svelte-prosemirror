import path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

import pkg from './package.json' assert { type: 'json' }

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve('src/lib/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => {
        if (format === 'cjs') {
          return 'index.cjs'
        } else {
          return 'index.js'
        }
      }
    },
    minify: false,
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]
    }
  },
  resolve: {
    dedupe: ['svelte']
  },
  plugins: [svelte({ extensions: ['.svelte'], emitCss: false }), tsconfigPaths()]
})
