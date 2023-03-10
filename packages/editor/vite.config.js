import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
export default {
  resolve: {
    alias: {
      $lib: resolve('./src/lib')
    }
  },
  plugins: [sveltekit()]
}
