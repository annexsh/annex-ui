import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import postcss from './postcss.config.js';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	},
	optimizeDeps: {
		exclude: ["codemirror", "@codemirror/language-javascript" /* ... */],
	},
});
