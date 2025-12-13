import { describe, expect, test } from 'vitest';
import { createHeadingIdGenerator, slugifyHeading } from './headingIds';

describe('slugifyHeading', () => {
	test('keeps Japanese characters and normalizes spacing', () => {
		expect(slugifyHeading('  jjとは？  ')).toBe('jjとは');
		expect(slugifyHeading('見出し その2')).toBe('見出し-その2');
	});

	test('removes markdown artifacts', () => {
		expect(slugifyHeading('**強調** と `code`')).toBe('強調-と-code');
		expect(slugifyHeading('[Link Text](https://example.com)')).toBe('link-text');
	});
});

describe('createHeadingIdGenerator', () => {
	test('dedupes duplicate headings', () => {
		const getId = createHeadingIdGenerator();

		expect(getId('同じ見出し')).toBe('同じ見出し');
		expect(getId('同じ見出し')).toBe('同じ見出し-2');
		expect(getId('同じ見出し')).toBe('同じ見出し-3');
	});
});
