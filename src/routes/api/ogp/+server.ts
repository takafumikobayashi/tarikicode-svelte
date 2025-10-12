import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return json({ error: 'URL parameter is required' }, { status: 400 });
	}

	try {
		// 対象URLのHTMLを取得
		const response = await fetch(targetUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (compatible; OGPBot/1.0)'
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch: ${response.status}`);
		}

		const html = await response.text();

		// OGPメタタグを抽出
		const ogpData = {
			title: extractOgpTag(html, 'og:title') || extractTag(html, 'title'),
			description:
				extractOgpTag(html, 'og:description') || extractMetaTag(html, 'description'),
			image: extractOgpTag(html, 'og:image'),
			siteName: extractOgpTag(html, 'og:site_name'),
			url: extractOgpTag(html, 'og:url') || targetUrl
		};

		// キャッシュヘッダーを設定（1時間）
		return json(ogpData, {
			headers: {
				'Cache-Control': 'public, max-age=3600'
			}
		});
	} catch (error) {
		console.error('Error fetching OGP data:', error);
		return json(
			{
				error: 'Failed to fetch OGP data',
				title: targetUrl,
				description: '',
				image: '',
				siteName: '',
				url: targetUrl
			},
			{ status: 500 }
		);
	}
};

// OGPタグを抽出するヘルパー関数（property="og:xxx" と name="og:xxx" 両方に対応）
function extractOgpTag(html: string, property: string): string {
	// パターン1: property="og:xxx" content="..."
	let regex = new RegExp(
		`<meta\\s+property=["']${property}["']\\s+content=["']([^"']+)["']`,
		'is'
	);
	let match = html.match(regex);
	if (match) return match[1];

	// パターン2: content="..." property="og:xxx"（順序逆）
	regex = new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+property=["']${property}["']`, 'is');
	match = html.match(regex);
	if (match) return match[1];

	// パターン3: name="og:xxx" content="..."（一部サイトで使用）
	regex = new RegExp(`<meta\\s+name=["']${property}["']\\s+content=["']([^"']+)["']`, 'is');
	match = html.match(regex);
	if (match) return match[1];

	// パターン4: content="..." name="og:xxx"（順序逆）
	regex = new RegExp(`<meta\\s+content=["']([^"']+)["']\\s+name=["']${property}["']`, 'is');
	match = html.match(regex);
	if (match) return match[1];

	return '';
}

// 通常のmetaタグを抽出するヘルパー関数
function extractMetaTag(html: string, name: string): string {
	const regex = new RegExp(`<meta\\s+name=["']${name}["']\\s+content=["']([^"']+)["']`, 'i');
	const match = html.match(regex);
	return match ? match[1] : '';
}

// titleタグを抽出するヘルパー関数
function extractTag(html: string, tag: string): string {
	const regex = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i');
	const match = html.match(regex);
	return match ? match[1].trim() : '';
}
