export interface SitemapUrlEntry {
	loc: string;
	lastmod?: string;
}

function escapeXml(value: string): string {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export function buildSitemapXml(entries: SitemapUrlEntry[]): string {
	const urls = entries
		.filter((entry) => entry.loc)
		.map((entry) => {
			const parts = [`<loc>${escapeXml(entry.loc)}</loc>`];
			if (entry.lastmod) {
				parts.push(`<lastmod>${escapeXml(entry.lastmod)}</lastmod>`);
			}
			return `<url>${parts.join('')}</url>`;
		})
		.join('');

	return [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		urls,
		'</urlset>'
	].join('');
}
