import pkg from './package.json';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
	build: {
		outDir: 'dist',
		lib: {
			entry: path.resolve('src/index.ts'),
			fileName: 'index',
			formats: ['es', 'cjs'],
		},
		minify: false,
		rollupOptions: {
			external: [...Object.keys(pkg.devDependencies || {})],
		},
	},
	plugins: [dts()],
});
