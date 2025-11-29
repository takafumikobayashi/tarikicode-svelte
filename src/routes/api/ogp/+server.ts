import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import iconv from 'iconv-lite';
import dns from 'dns';
import net from 'net';
import { Agent, fetch as undiciFetch } from 'undici';

const MAX_REDIRECTS = 3;
const REQUEST_TIMEOUT_MS = 5000;
const MAX_RESPONSE_BYTES = 1024 * 1024; // 1MB

export const GET: RequestHandler = async ({ url }) => {
	const targetUrl = url.searchParams.get('url');

	if (!targetUrl) {
		return json({ error: 'URL parameter is required' }, { status: 400 });
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(targetUrl);
	} catch {
		return json({ error: 'Invalid URL' }, { status: 400 });
	}

	try {
		const { response, finalUrl, cleanup } = await fetchWithValidation(parsedUrl);

		try {
			// 対象URLのHTMLを取得
			// 独自のUser-Agentを使用（サイト運営者が識別できるように）
			// Bot保護があるサイトでは、pickup-articles.jsonで画像URLを直接指定してください
			if (!response.ok) {
				throw new Error(`Failed to fetch: ${response.status}`);
			}

			const contentLengthHeader = response.headers.get('content-length');
			if (contentLengthHeader && Number(contentLengthHeader) > MAX_RESPONSE_BYTES) {
				throw new Error('Response too large');
			}

			// ストリームでデータを取得し、サイズ制限を超えたら中断する
			const uint8Array = await readBodyWithLimit(response, MAX_RESPONSE_BYTES);

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
				url: extractOgpTag(html, 'og:url') || finalUrl.toString()
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
		} finally {
			await cleanup();
		}
	} catch (error) {
		console.error('Error fetching OGP data:', error);
		const status = resolveStatusCode(error);
		return json(
			{
				error: 'Failed to fetch OGP data',
				title: targetUrl,
				description: '',
				image: '',
				siteName: '',
				url: targetUrl
			},
			{ status }
		);
	}
};

class InvalidRequestError extends Error {}
class ForbiddenRequestError extends Error {}

function resolveStatusCode(error: unknown): number {
	if (error instanceof ForbiddenRequestError) return 403;
	if (error instanceof InvalidRequestError) return 400;
	return 500;
}

async function readBodyWithLimit(response: Response, limit: number): Promise<Uint8Array> {
	if (!response.body) {
		return new Uint8Array(0);
	}

	const reader = response.body.getReader();
	const chunks: Uint8Array[] = [];
	let receivedLength = 0;

	try {
		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			if (value) {
				chunks.push(value);
				receivedLength += value.length;

				if (receivedLength > limit) {
					// ストリームをキャンセルして中断
					await reader.cancel('Response too large');
					throw new Error('Response too large');
				}
			}
		}
	} catch (e) {
		// エラー発生時もキャンセルを試みる（念のため）
		try {
			await reader.cancel();
		} catch {
			/* ignore */
		}
		throw e;
	}

	// チャンクを結合
	const result = new Uint8Array(receivedLength);
	let position = 0;
	for (const chunk of chunks) {
		result.set(chunk, position);
		position += chunk.length;
	}

	return result;
}

async function fetchWithValidation(
	initialUrl: URL
): Promise<{ response: Response; finalUrl: URL; cleanup: () => Promise<void> }> {
	let currentUrl = initialUrl;

	for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount++) {
		const resolution = await resolveSafeUrl(currentUrl);

		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
		const agent = new Agent({
			connect: {
				lookup: createBoundLookup(currentUrl.hostname, resolution)
			}
		});

		const cleanup = async () => {
			clearTimeout(timeoutId);
			await agent.close();
		};

		let response: Response;

		try {
			response = (await undiciFetch(currentUrl, {
				headers: {
					'User-Agent': 'tariki-code-bot/1.0 (+https://tariki-code.tokyo)'
				},
				redirect: 'manual',
				signal: controller.signal,
				dispatcher: agent
			})) as unknown as Response;
		} catch (error) {
			await cleanup();
			if (error instanceof Error && error.name === 'AbortError') {
				throw new InvalidRequestError('Request timed out');
			}
			throw error;
		}

		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('location');
			await cleanup(); // リダイレクト時は現在の接続を閉じる

			if (!location) {
				throw new InvalidRequestError('Redirect location missing');
			}

			currentUrl = new URL(location, currentUrl);
			continue;
		}

		return { response, finalUrl: currentUrl, cleanup };
	}

	throw new InvalidRequestError('Too many redirects');
}

async function resolveSafeUrl(target: URL): Promise<dns.LookupAddress> {
	if (!['http:', 'https:'].includes(target.protocol)) {
		throw new InvalidRequestError('Invalid protocol');
	}

	const hostname = target.hostname;

	if (isForbiddenIp(hostname)) {
		throw new ForbiddenRequestError('Access to private network is forbidden');
	}

	if (net.isIP(hostname) === 0) {
		let lookupResults;
		try {
			lookupResults = await dns.promises.lookup(hostname, { all: true });
		} catch (error) {
			console.error('DNS lookup failed:', error);
			throw new InvalidRequestError('DNS lookup failed');
		}

		if (lookupResults.some((record) => isForbiddenIp(record.address))) {
			throw new ForbiddenRequestError('Access to private network is forbidden');
		}

		// IPv4を優先して探索（IPv6トラブル回避のため）
		const ipv4 = lookupResults.find((r) => r.family === 4);
		if (ipv4) return ipv4;

		return lookupResults[0];
	}

	return { address: hostname, family: net.isIP(hostname) } as dns.LookupAddress;
}

function createBoundLookup(hostname: string, resolution: dns.LookupAddress) {
	return (
		requestedHost: string,
		options: dns.LookupOptions,
		callback: (
			err: Error | null,
			address: string | dns.LookupAddress[],
			family?: number
		) => void
	): void => {
		if (requestedHost !== hostname) {
			process.nextTick(() => callback(new Error('Unexpected hostname lookup'), '', 0));
			return;
		}

		// options.all が true なら配列、そうでなければ単一アドレスを返す
		if (options.all) {
			process.nextTick(() =>
				callback(null, [{ address: resolution.address, family: resolution.family }])
			);
		} else {
			process.nextTick(() => callback(null, resolution.address, resolution.family));
		}
	};
}

function normalizeIPv6(ip: string): string {
	let parts = ip.toLowerCase().split(':');
	const index = parts.indexOf('');

	if (index !== -1) {
		// "::" がある場合、0で埋める
		const missing = 8 - (parts.length - 1);
		const zeros = Array(missing).fill('0000');
		parts.splice(index, 1, ...zeros);
	}

	// 各ブロックを4桁にパディング
	return parts.map((part) => part.padStart(4, '0')).join(':');
}

function isForbiddenIp(address: string): boolean {
	const ipVersion = net.isIP(address);

	if (ipVersion === 4) {
		const parts = address.split('.').map((part) => Number(part));
		if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
			return false;
		}

		const [a, b] = parts;

		if (a === 10 || a === 127 || a === 0) return true;
		if (a === 169 && b === 254) return true;
		if (a === 172 && b >= 16 && b <= 31) return true;
		if (a === 192 && b === 168) return true;
		if (a === 100 && b >= 64 && b <= 127) return true;
		if (a >= 224) return true; // multicast/reserved

		return false;
	}

	if (ipVersion === 6) {
		// IPv4-mapped IPv6 (::ffff:1.2.3.4) の処理
		if (address.toLowerCase().includes('.')) {
			const lastColon = address.lastIndexOf(':');
			const ipv4Part = address.substring(lastColon + 1);
			if (net.isIPv4(ipv4Part)) {
				return isForbiddenIp(ipv4Part);
			}
		}

		const normalized = normalizeIPv6(address);

		// ::1 (Loopback) -> 0000:0000:0000:0000:0000:0000:0000:0001
		if (normalized === '0000:0000:0000:0000:0000:0000:0000:0001') return true;
		// :: (Unspecified) -> 0000:0000:0000:0000:0000:0000:0000:0000
		if (normalized === '0000:0000:0000:0000:0000:0000:0000:0000') return true;

		// fc00::/7 (Unique Local Address) -> fc00... ~ fdff...
		if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
		// fe80::/10 (Link-local) -> fe80... ~ febf...
		const prefix = parseInt(normalized.substring(0, 4), 16);
		if (prefix >= 0xfe80 && prefix <= 0xfebf) return true;
		// ff00::/8 (Multicast) -> ff00...
		if (normalized.startsWith('ff')) return true;

		return false;
	}

	return false;
}

// OGPタグを抽出するヘルパー関数（property="og:xxx" と name="og:xxx"両方に対応）

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractOgpTag(html: string, property: string): string {
	const safeProp = escapeRegex(property);
	const patterns = [
		new RegExp(
			`<meta[^>]*property\\s*=\\s*["']${safeProp}["'][^>]*content\\s*=\\s*["']([^"']+)["'][^>]*>`,
			'i'
		),
		new RegExp(
			`<meta[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*property\\s*=\\s*["']${safeProp}["'][^>]*>`,
			'i'
		),
		new RegExp(
			`<meta[^>]*name\\s*=\\s*["']${safeProp}["'][^>]*content\\s*=\\s*["']([^"']+)["'][^>]*>`,
			'i'
		),
		new RegExp(
			`<meta[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*name\\s*=\\s*["']${safeProp}["'][^>]*>`,
			'i'
		)
	];

	for (const regex of patterns) {
		const match = html.match(regex);
		if (match) return match[1];
	}

	return '';
}

function extractMetaTag(html: string, name: string): string {
	const safeName = escapeRegex(name);
	const patterns = [
		new RegExp(
			`<meta[^>]*name\\s*=\\s*["']${safeName}["'][^>]*content\\s*=\\s*["']([^"']+)["'][^>]*>`,
			'i'
		),
		new RegExp(
			`<meta[^>]*content\\s*=\\s*["']([^"']+)["'][^>]*name\\s*=\\s*["']${safeName}["'][^>]*>`,
			'i'
		)
	];

	for (const regex of patterns) {
		const match = html.match(regex);
		if (match) return match[1];
	}

	return '';
}

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
