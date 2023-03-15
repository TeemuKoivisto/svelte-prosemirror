import path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

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
    minify: false
  },
  resolve: {
    dedupe: ['svelte']
  },
  plugins: [
    svelte({ extensions: ['.svelte'], emitCss: false }),
    tsconfigPaths()
    // {
    //   name: 'wrap-in-iife',
    //   generateBundle(outputOptions, bundle) {
    //     Object.keys(bundle).forEach(fileName => {
    //       const file = bundle[fileName]
    //       if (fileName.slice(-3) === '.js' && 'code' in file) {
    //         file.code = `(() => {\n${file.code}})()`
    //       }
    //     })
    //   }
    // }
  ]
})
