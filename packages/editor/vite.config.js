import { sveltekit } from '@sveltejs/kit/vite'

import { resolve } from 'path'

/** @type {import('vite').UserConfig} */
export default {
  resolve: {
    alias: {
      $lib: resolve('./src/lib')
    }
  },
  plugins: [sveltekit()]
}
