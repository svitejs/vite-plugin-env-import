import { Plugin, loadEnv, ResolvedConfig } from 'vite';
import { is_valid_identifier } from './is-valid-identifier';

const prefix = 'virtual:env';

function is_public(id: string) {
	return id.includes(':public');
}

function is_runtime(id: string) {
	return id.includes(':runtime');
}

function load_env(config: ResolvedConfig) {
	const { mode, envDir, envPrefix } = config;
	const prefixes: string[] = Array.isArray(envPrefix) ? envPrefix : [envPrefix ?? 'VITE_'];
	const hasPublicPrefix = (s: string) => prefixes.some((p: string) => s.startsWith(p));
	const entries = Object.entries(loadEnv(mode, envDir ?? process.cwd(), '')).filter(([k]) =>
		is_valid_identifier(k)
	);

	return {
		public: Object.fromEntries(entries.filter(([k]) => hasPublicPrefix(k))),
		private: Object.fromEntries(entries.filter(([k]) => !hasPublicPrefix(k)))
	};
}

function create_module(env: Record<string, string>, is_dynamic: boolean) {
	return (
		Object.entries(env)
			.map(([key, value]) => {
				return `export const ${key} = ${
					is_dynamic ? `process.env.${key}` : JSON.stringify(value)
				};`;
			})
			.join('\n') + `\n`
	);
}

function throw_on_illegal_import(id: string, importer: string | undefined, ssr: boolean) {
	if (!ssr) {
		if (!is_public(id)) {
			throw new Error(
				`Illegal import of private env${
					importer ? ` in ${importer} ` : ' '
				}outside of ssr context. You can only import from '${prefix}:public' in clientside code`
			);
		} else if (is_runtime(id)) {
			throw new Error(
				`Illegal import of runtime env${
					importer ? ` in ${importer} ` : ' '
				}outside of ssr context. You can only import from '${id.replace(
					'\0',
					''
				)}' in serverside code`
			);
		}
	}
}

export function envImport(): Plugin {
	let config: ResolvedConfig;
	let env: any;
	return {
		name: 'vite-plugin-env-import',
		enforce: 'pre',

		configResolved(_config) {
			config = _config;
		},

		resolveId(id, importer, options) {
			if (!id.startsWith(prefix)) {
				return;
			}
			throw_on_illegal_import(id, importer, !!options?.ssr);
			return { id: `\0${id}`, moduleSideEffects: false };
		},

		load(id, options) {
			if (!id.startsWith(`\0${prefix}`)) {
				return;
			}
			throw_on_illegal_import(id, undefined, !!options?.ssr);
			if (!env) {
				env = load_env(config);
			}
			const pub = is_public(id);
			const dyn = !!options?.ssr && is_runtime(id);
			return create_module(pub ? env.public : env.private, dyn);
		}
	};
}
