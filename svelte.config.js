import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

const buildPath = process.env.BUILD_PATH || 'dist';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information groups preprocessors
	preprocess: [vitePreprocess()],

	kit: {
		adapter: adapter({
			pages: buildPath,
			assets: buildPath,
			fallback: 'index.html',
		})
	}
};

export default config;
