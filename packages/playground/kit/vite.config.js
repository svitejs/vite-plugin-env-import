import { sveltekit } from '@sveltejs/kit/vite';
import { envImport } from '@svitejs/vite-plugin-env-import';
/** @type {import('vite').UserConfig} */
const config = {
	plugins: [envImport(), sveltekit()]
};

export default config;
