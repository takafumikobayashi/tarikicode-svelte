import { describe, expect, test } from 'vitest';
import { buildSitemapXml } from './sitemap';

describe('buildSitemapXml', () => {
	test('renders urlset with loc and optional lastmod', () => {
		const xml = buildSitemapXml([
			{ loc: 'https://example.com/' },
			{ loc: 'https://example.com/blog/1', lastmod: '2025-01-01' }
		]);

		expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
		expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
		expect(xml).toContain('<loc>https://example.com/</loc>');
		expect(xml).toContain('<loc>https://example.com/blog/1</loc>');
		expect(xml).toContain('<lastmod>2025-01-01</lastmod>');
	});

	test('escapes xml special characters', () => {
		const xml = buildSitemapXml([
			{ loc: 'https://example.com/?a=1&b=2' },
			{ loc: 'https://example.com/<tag>', lastmod: '2025-01-01' }
		]);

		expect(xml).toContain('<loc>https://example.com/?a=1&amp;b=2</loc>');
		expect(xml).toContain('<loc>https://example.com/&lt;tag&gt;</loc>');
	});
});
