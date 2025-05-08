const preprocessOptions = {
	scss: {},
};

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
	preprocess: vitePreprocess(),
	preprocessOptions,
	compilerOptions: {
		runes: true,
	},
};
