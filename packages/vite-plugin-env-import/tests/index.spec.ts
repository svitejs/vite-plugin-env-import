import { describe, it, expect, beforeEach } from 'vitest';
import { envImport } from '../src';

describe('vite-plugin-env-import', () => {
	let plugin;
	beforeEach(() => {
		plugin = envImport();
		plugin.configResolved({ mode: 'testing', envDir: process.cwd() });
	});

	it('should be named', function () {
		expect(plugin.name).toBe('vite-plugin-env-import');
	});

	describe('resolveId', () => {
		it('should ignore ids without prefix', () => {
			expect(plugin.resolveId('foo')).toBe(undefined);
		});
		it('should resolve env in ssr', () => {
			expect(plugin.resolveId('virtual:env', 'foo', { ssr: true }).id).toBe('\0virtual:env');
		});
		it('should resolve runtime env in ssr', () => {
			expect(plugin.resolveId('virtual:env:runtime', 'foo', { ssr: true }).id).toBe(
				'\0virtual:env:runtime'
			);
		});
		it('should resolve public env in ssr', () => {
			expect(plugin.resolveId('virtual:env:public', 'foo', { ssr: true }).id).toBe(
				'\0virtual:env:public'
			);
		});
		it('should resolve public env in client code', () => {
			expect(plugin.resolveId('virtual:env:public', 'foo').id).toBe('\0virtual:env:public');
		});

		it('should not resolve env in client code', () => {
			expect(() => {
				plugin.resolveId('virtual:env', 'foo');
			}).toThrow(
				`Illegal import of private env in foo outside of ssr context. You can only import from 'virtual:env:public' in clientside code`
			);
		});

		it('should not resolve runtime env in client code', () => {
			expect(() => {
				plugin.resolveId('virtual:env:public:runtime', 'foo');
			}).toThrow(
				`Illegal import of runtime env in foo outside of ssr context. You can only import from 'virtual:env:public:runtime' in serverside code`
			);
		});
	});

	describe('load', () => {
		it('should not load ids without prefix', () => {
			expect(plugin.load('foo')).toBe(undefined);
		});

		it('should load virtual:env during ssr', () => {
			const test_val = `${+new Date()}`;
			process.env.TEST_VAL = test_val;
			const env_module = plugin.load('\0virtual:env', { ssr: true });
			expect(env_module).toBeDefined();
			expect(env_module).toContain(`export const TEST_VAL = "${test_val}"`);
		});

		it('should load virtual:env:runtime during ssr', () => {
			const test_val = `${+new Date()}`;
			process.env.TEST_VAL = test_val;
			const env_module = plugin.load('\0virtual:env:runtime', { ssr: true });
			expect(env_module).toBeDefined();
			expect(env_module).toContain(`export const TEST_VAL = process.env.TEST_VAL;`);
		});

		it('should load virtual:env:public during ssr', () => {
			const test_val = `${+new Date()}`;
			process.env.VITE_TEST_VAL = test_val;
			const env_module = plugin.load('\0virtual:env:public', { ssr: true });
			expect(env_module).toBeDefined();
			expect(env_module).toContain(`export const VITE_TEST_VAL = "${test_val}"`);
		});

		it('should load virtual:env:public in client code', () => {
			const test_val = `${+new Date()}`;
			process.env.VITE_TEST_VAL = test_val;
			const env_module = plugin.load('\0virtual:env:public');
			expect(env_module).toBeDefined();
			expect(env_module).toContain(`export const VITE_TEST_VAL = "${test_val}"`);
		});

		it('should load virtual:env:public:runtime during ssr', () => {
			const test_val = `${+new Date()}`;
			process.env.VITE_TEST_VAL = test_val;
			const env_module = plugin.load('\0virtual:env:public:runtime', { ssr: true });
			expect(env_module).toBeDefined();
			expect(env_module).toContain(`export const VITE_TEST_VAL = process.env.VITE_TEST_VAL;`);
		});

		it('should not load virtual:env in client code', () => {
			const test_val = `${+new Date()}`;
			process.env.TEST_VAL = test_val;
			expect(() => {
				plugin.load('\0virtual:env');
			}).toThrow(
				`Illegal import of private env outside of ssr context. You can only import from 'virtual:env:public' in clientside code`
			);
		});

		it('should not load virtual:env:runtime in client code', () => {
			const test_val = `${+new Date()}`;
			process.env.TEST_VAL = test_val;
			expect(() => {
				plugin.load('\0virtual:env:runtime');
			}).toThrow(
				`Illegal import of private env outside of ssr context. You can only import from 'virtual:env:public' in clientside code`
			);
		});

		it('should not load virtual:env:public:runtime in client code', () => {
			const test_val = `${+new Date()}`;
			process.env.VITE_TEST_VAL = test_val;
			expect(() => {
				plugin.load('\0virtual:env:public:runtime');
			}).toThrow(
				`Illegal import of runtime env outside of ssr context. You can only import from 'virtual:env:public:runtime' in serverside code`
			);
		});
	});
});
