import { envImport } from '@svitejs/vite-plugin-env-import';
import inspect from 'vite-plugin-inspect';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [inspect(), envImport()]
});
