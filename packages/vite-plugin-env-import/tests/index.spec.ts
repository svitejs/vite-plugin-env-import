import { describe, it, expect } from 'vitest';
import { envImport } from '../src';

describe('vite-plugin-env-import', () => {
	it('should be named', function () {
		expect(envImport().name).toBe('vite-plugin-env-import');
	});
});
