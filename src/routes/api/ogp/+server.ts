import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import iconv from 'iconv-lite';

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return json({ error: 'URL parameter is required' }, { status: 400 });
	}

	// URLのバリデーション (SSRF対策)
	try {
		const parsedUrl = new URL(targetUrl);

		// http/https以外は拒否
		if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
			return json({ error: 'Invalid protocol' }, { status: 400 });
		}

		// プライベートIP・ローカルホストへのアクセス拒否 (簡易チェック)
		// 本番環境ではより厳密なIPフィルタリングライブラリの使用を推奨
		const hostname = parsedUrl.hostname;
		if (
			hostname === 'localhost' ||
			hostname === '127.0.0.1' ||
			hostname === '::1' ||
			hostname.startsWith('192.168.') ||
			hostname.startsWith('10.') ||
			(hostname.startsWith('172.') &&
				parseInt(hostname.split('.')[1]) >= 16 &&
				parseInt(hostname.split('.')[1]) <= 31)
		) {
			return json({ error: 'Access to private network is forbidden' }, { status: 403 });
		}
	} catch (e) {
		return json({ error: 'Invalid URL' }, { status: 400 });
	}

	try {
		// 対象URLのHTMLを取得
		// 独自のUser-Agentを使用（サイト運営者が識別できるように）
		// Bot保護があるサイトでは、pickup-articles.jsonで画像URLを直接指定してください
		const response = await fetch(targetUrl, {
			headers: {
				'User-Agent': 'tariki-code-bot/1.0 (+https://tariki-code.tokyo)'
			}
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch: ${response.status}`);
		}

		// バイナリデータとして取得（文字エンコーディング対応のため）
		const buffer = await response.arrayBuffer();
		const uint8Array = new Uint8Array(buffer);

		// HTMLから文字エンコーディングを検出
		// まずUTF-8として読み取り、meta charsetタグを探す
		const preliminaryHtml = iconv.decode(Buffer.from(uint8Array), 'utf-8');
		const charset = detectCharset(preliminaryHtml, response.headers.get('content-type'));

		// 検出した文字エンコーディングでデコード
		const html = iconv.decode(Buffer.from(uint8Array), charset);

		// OGPメタタグを抽出
		const ogpData = {
			title: extractOgpTag(html, 'og:title') || extractTag(html, 'title'),
			description:
				extractOgpTag(html, 'og:description') || extractMetaTag(html, 'description'),
			image: extractOgpTag(html, 'og:image'),
			siteName: extractOgpTag(html, 'og:site_name'),
			url: extractOgpTag(html, 'og:url') || targetUrl
		};

		// キャッシュヘッダーを設定（開発中はキャッシュ無効、本番は24時間）
		const isProduction = process.env.NODE_ENV === 'production';
		return json(ogpData, {
			headers: {
				'Cache-Control': isProduction
					? 'public, max-age=86400'
					: 'no-cache, no-store, must-revalidate'
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

// HTMLから文字エンコーディングを検出するヘルパー関数
function detectCharset(html: string, contentType: string | null): string {
	// 1. Content-Typeヘッダーからcharsetを取得
	if (contentType) {
		const charsetMatch = contentType.match(/charset=([^;\s]+)/i);
		if (charsetMatch) {
			return normalizeCharset(charsetMatch[1]);
		}
	}

	// 2. <meta charset="..."> タグから取得
	const metaCharsetMatch = html.match(/<meta\s+charset=["']?([^"'\s>]+)["']?/i);
	if (metaCharsetMatch) {
		return normalizeCharset(metaCharsetMatch[1]);
	}

	// 3. <meta http-equiv="content-type" content="...charset=..."> タグから取得
	const metaContentTypeMatch = html.match(
		/<meta\s+http-equiv=["']content-type["']\s+content=["']([^"']+)["']/i
	);
	if (metaContentTypeMatch) {
		const charsetMatch = metaContentTypeMatch[1].match(/charset=([^;\s]+)/i);
		if (charsetMatch) {
			return normalizeCharset(charsetMatch[1]);
		}
	}

	// 4. content属性が先に来るパターン
	const metaContentTypeMatch2 = html.match(
		/<meta\s+content=["']([^"']+)["']\s+http-equiv=["']content-type["']/i
	);
	if (metaContentTypeMatch2) {
		const charsetMatch = metaContentTypeMatch2[1].match(/charset=([^;\s]+)/i);
		if (charsetMatch) {
			return normalizeCharset(charsetMatch[1]);
		}
	}

	// デフォルトはUTF-8
	return 'utf-8';
}

// 文字エンコーディング名を正規化するヘルパー関数
function normalizeCharset(charset: string): string {
	const normalized = charset.toLowerCase().trim();

	// よくある別名を正規化
	const aliases: Record<string, string> = {
		shift_jis: 'shift_jis',
		'shift-jis': 'shift_jis',
		sjis: 'shift_jis',
		'x-sjis': 'shift_jis',
		'euc-jp': 'euc-jp',
		eucjp: 'euc-jp',
		'utf-8': 'utf-8',
		utf8: 'utf-8',
		'iso-2022-jp': 'iso-2022-jp'
	};

	return aliases[normalized] || normalized;
}
