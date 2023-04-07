import { sveltekit } from '@sveltejs/kit/vite'

import { resolve } from 'path'

const { GH_PAGES } = process.env

/** @type {import('vite').UserConfig} */
export default {
  base: GH_PAGES ? '/svelte-prosemirror/' : undefined,
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $config: resolve('./src/config'),
      $context: resolve('./src/context'),
      $elements: resolve('./src/elements'),
      $stores: resolve('./src/stores'),
      $types: resolve('./src/types')
    }
  }
}
