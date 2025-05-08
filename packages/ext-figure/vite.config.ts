import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
	build: {
		outDir: 'dist',
		lib: {
			entry: path.resolve('src/lib/index.ts'),
			formats: ['es', 'cjs'],
			fileName: format => {
				if (format === 'cjs') {
					return 'index.cjs';
				} else {
					return 'index.js';
				}
			},
		},
		minify: false,
	},
	resolve: {
		dedupe: ['svelte'],
	},
	plugins: [svelte({ extensions: ['.svelte'], emitCss: false }), tsconfigPaths()],
});
