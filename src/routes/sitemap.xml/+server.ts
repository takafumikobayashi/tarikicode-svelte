import { AppConfig } from '$lib/AppConfig';
import { getAllPostsMetadata } from '$lib/utils/posts';
import { buildSitemapXml, type SitemapUrlEntry } from '$lib/utils/sitemap';
import type { RequestHandler } from './$types';

function ensureNoTrailingSlash(url: string): string {
	return url.endsWith('/') ? url.slice(0, -1) : url;
}

export const GET: RequestHandler = async () => {
	const baseUrl = ensureNoTrailingSlash(AppConfig.url);
	const posts = await getAllPostsMetadata({ resolveImages: false });

	const entries: SitemapUrlEntry[] = [
		{ loc: `${baseUrl}/` },
		{ loc: `${baseUrl}/about` },
		{ loc: `${baseUrl}/blog` },
		...posts
			.filter((post) => post.type === 'blog')
			.map((post) => ({
				loc: `${baseUrl}/blog/${post.slug}`,
				lastmod: post.date
			}))
	];

	const xml = buildSitemapXml(entries);

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=0, s-maxage=3600'
		}
	});
};
