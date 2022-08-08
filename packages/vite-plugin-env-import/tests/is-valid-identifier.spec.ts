import { describe, it, expect } from 'vitest';
import { is_valid_identifier } from '../src/is-valid-identifier';

describe('is_valid_identifier', () => {
	it('should allow lowercase letter', () => {
		expect(is_valid_identifier('a')).toBe(true);
	});
	it('should allow uppercase letter', () => {
		expect(is_valid_identifier('A')).toBe(true);
	});
	it('should allow underscore', () => {
		expect(is_valid_identifier('_')).toBe(true);
	});
	it('should reject leading number', () => {
		expect(is_valid_identifier('1')).toBe(false);
	});
	it('should allow non-leading number', () => {
		expect(is_valid_identifier('a1')).toBe(true);
	});
	it('should reject reserved', () => {
		expect(is_valid_identifier('default')).toBe(false);
	});
	it('should reject non-alphanumeric', () => {
		for (const c of '()[]{}/!"§$%&/.-,:;#+* =\''.split('')) {
			expect(is_valid_identifier(`a${c}b`), `character: "${c}"`).toBe(false);
		}
	});
});
