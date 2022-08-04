import { Plugin } from 'vite';

export interface Options {
	// add plugin options here
}

const DEFAULT_OPTIONS: Options = {
	// set default values
};

export function envImport(inlineOptions?: Partial<Options>): Plugin {
	// eslint-disable-next-line no-unused-vars
	const options = {
		...DEFAULT_OPTIONS,
		...inlineOptions
	};
	return {
		name: 'vite-plugin-env-import'
		// add hooks here
	};
}
