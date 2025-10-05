import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return json({ error: 'URL parameter is required' }, { status: 400 });
	}

	try {
		const response = await fetch(targetUrl, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (compatible; OGPBot/1.0; +https://tariki-code.tokyo)'
			}
		});

		if (!response.ok) {
			return json({ error: 'Failed to fetch URL' }, { status: response.status });
		}

		const html = await response.text();

		// OGP情報を抽出
		const ogpData = {
			title: extractOgp(html, 'og:title') || extractTitle(html),
			description: extractOgp(html, 'og:description') || extractDescription(html),
			image: extractOgp(html, 'og:image'),
			site: extractOgp(html, 'og:site_name') || new URL(targetUrl).hostname
		};

		return json(ogpData);
	} catch (error) {
		console.error('OGP fetch error:', error);
		return json({ error: 'Failed to fetch OGP data' }, { status: 500 });
	}
};

function extractOgp(html: string, property: string): string | null {
	const regex = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["']`, 'i');
	const match = html.match(regex);
	return match ? match[1] : null;
}

function extractTitle(html: string): string {
	const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
	return match ? match[1] : '';
}

function extractDescription(html: string): string {
	const regex = /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i;
	const match = html.match(regex);
	return match ? match[1] : '';
}
