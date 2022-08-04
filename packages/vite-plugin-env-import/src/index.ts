import { Plugin, loadEnv, ResolvedConfig } from 'vite';

export interface Options {
	// add plugin options here
	prefix: string;
}

const DEFAULT_OPTIONS: Options = {
	// set default values
	prefix: 'virtual:env'
};

function isPublic(id: string) {
	return id.includes(':public');
}

function isDynamic(id: string) {
	return id.includes(':dynamic');
}

function readEnv(config: ResolvedConfig) {
	const { mode, envDir, envPrefix } = config;
	const prefixes: string[] = Array.isArray(envPrefix) ? envPrefix : [envPrefix ?? 'VITE_'];
	const hasPublicPrefix = (s: string) => prefixes.some((p: string) => s.startsWith(p));
	const entries = Object.entries(loadEnv(mode, envDir ?? process.cwd(), '')).filter(([k]) =>
		isLegalIdenifier(k)
	);

	return {
		public: Object.fromEntries(entries.filter(([k]) => hasPublicPrefix(k))),
		private: Object.fromEntries(entries.filter(([k]) => !hasPublicPrefix(k)))
	};
}

function createModule(env: Record<string, string>, isDynamic: boolean) {
	return (
		Object.entries(env)
			.map(([key, value]) => {
				return `export const ${key} = ${isDynamic ? `process.env.${key}` : JSON.stringify(value)};`;
			})
			.join('\n') + `\n`
	);
}

function isLegalIdenifier(key: string) {
	return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) && !reserved.has(key);
}

export const reserved = new Set([
	'do',
	'if',
	'in',
	'for',
	'let',
	'new',
	'try',
	'var',
	'case',
	'else',
	'enum',
	'eval',
	'null',
	'this',
	'true',
	'void',
	'with',
	'await',
	'break',
	'catch',
	'class',
	'const',
	'false',
	'super',
	'throw',
	'while',
	'yield',
	'delete',
	'export',
	'import',
	'public',
	'return',
	'static',
	'switch',
	'typeof',
	'default',
	'extends',
	'finally',
	'package',
	'private',
	'continue',
	'debugger',
	'function',
	'arguments',
	'interface',
	'protected',
	'implements',
	'instanceof'
]);

export function envImport(inlineOptions?: Partial<Options>): Plugin {
	// eslint-disable-next-line no-unused-vars
	const options = {
		...DEFAULT_OPTIONS,
		...inlineOptions
	};
	const { prefix } = options;
	const resolvedPrefix = `\0${prefix}`;
	let config: ResolvedConfig;
	let env: any;
	return {
		name: 'vite-plugin-env-import',
		enforce: 'pre',

		configResolved(_config) {
			config = _config;
		},

		resolveId(id, importer, { ssr }) {
			if (!id.startsWith(prefix)) {
				return null;
			}
			if (!isPublic(id) && !ssr) {
				throw new Error(
					`Illegal import of private env ${id} in ${importer} outside of ssr context`
				);
			}
			return `\0${id}`;
		},
		load(id) {
			if (!id.startsWith(resolvedPrefix)) {
				return;
			}
			if (!env) {
				env = readEnv(config);
			}

			const pub = isPublic(id);
			const dyn = isDynamic(id);

			const mod = createModule(pub ? env.public : env.private, dyn);
			console.log({ id, pub, dyn, mod });
			return mod;
		}
	};
}
