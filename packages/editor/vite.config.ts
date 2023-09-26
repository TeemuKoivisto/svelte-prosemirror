import { resolve } from 'path'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      $lib: resolve('./src/lib')
    }
  },
  plugins: [sveltekit()]
})
