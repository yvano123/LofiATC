import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-static met fallback en strict false
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'fallback.html',
			strict: false
		}),
		// alle paden relatief
		paths: {
			base: '',
			assets: ''
		}
	}
};

export default config;
