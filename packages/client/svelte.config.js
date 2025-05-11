import adapter from '@sveltejs/adapter-static';

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
export default {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: vitePreprocess(),
    kit: {
        files: {
            routes: './src/routes',
            lib: './src/lib',
        },
        adapter: adapter({
            // default options are shown
            pages: 'build',
            assets: 'build',
            fallback: '200.html',
        }),
        alias: {
            $lib: 'src/lib',
            $components: 'src/components',
            $config: 'src/config',
            $context: 'src/context',
            $elements: 'src/elements',
            $stores: 'src/stores',
            $utils: 'src/utils',
        },
    },
};
