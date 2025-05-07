/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve('src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    minify: false,
    rollupOptions: {
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]
    }
  },
  plugins: [dts(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})
