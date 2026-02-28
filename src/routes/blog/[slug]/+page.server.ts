import { Marked, Renderer } from 'marked';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import { AppConfig } from '$lib/AppConfig';
import { createHeadingIdGenerator } from '$lib/utils/headingIds';
import { Window } from 'happy-dom';
import DOMPurify from 'dompurify';

// Markdownファイルをビルド時にバンドルするためにimport.meta.globを使用
const posts = import.meta.glob('/src/posts/**/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

// 外部URLからOGP画像を取得するヘルパー関数
const MAX_REDIRECTS = 3;

async function fetchOgpImage(url: string): Promise<string> {
	try {
		let currentUrl = url;

		// リダイレクトを手動で追跡（最大3回）
		for (let i = 0; i <= MAX_REDIRECTS; i++) {
			const response = await fetch(currentUrl, {
				headers: {
					'User-Agent': 'tariki-code-bot/1.0 (+https://tariki-code.tokyo)',
					Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
				},
				redirect: 'manual'
			});

			// リダイレクトの場合は追跡
			if (response.status >= 300 && response.status < 400) {
				const location = response.headers.get('location');
				if (!location) return '';
				currentUrl = new URL(location, currentUrl).toString();
				continue;
			}

			if (!response.ok) return '';

			const html = await response.text();

			// og:image タグを抽出（複数パターン対応）
			const patterns = [
				/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
				/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i,
				/<meta\s+name=["']og:image["']\s+content=["']([^"']+)["']/i,
				/<meta\s+content=["']([^"']+)["']\s+name=["']og:image["']/i
			];

			for (const pattern of patterns) {
				const match = html.match(pattern);
				if (match && match[1]) {
					return match[1];
				}
			}

			return '';
		}

		return '';
	} catch (err) {
		console.error(`Error fetching OGP image from ${url}:`, err);
		return '';
	}
}

export const load = async ({ params }: { params: { slug: string } }) => {
	const { slug } = params;

	let fileContent: string | undefined;

	// slugに一致するファイルを探す
	for (const path in posts) {
		if (path.endsWith(`/${slug}.md`)) {
			fileContent = posts[path] as string;
			break;
		}
	}

	if (fileContent) {
		try {
			const { data, content } = matter(fileContent);

			// OGPカード記法を事前変換（marked処理前に置き換え）
			const processedContent = content.replace(
				/\[\[ogp:(https?:\/\/[^\]]+)\]\]/g,
				(match, url) => {
					// HTMLコメントで囲んでmarkedが処理しないようにする
					return `\n\n<ogp-card data-url="${url}"></ogp-card>\n\n`;
				}
			);

			// MarkdownをHTMLに変換（見出しへidを付与してアンカー化）
			const getHeadingId = createHeadingIdGenerator();
			const renderer = new Renderer();
			renderer.heading = (text, level, raw) => {
				const id = getHeadingId(raw);
				return `<h${level} id="${id}">${text}</h${level}>\n`;
			};

			const markedInstance = new Marked({ renderer });
			let htmlContent = markedInstance.parse(processedContent) as string;

			// Mermaidブロックを退避（コードテキストのみ保存し復元時に構造を再構築）
			const mermaidBlocks: string[] = [];
			const mermaidRegex =
				/<pre><code[^>]*class=["'][^"']*mermaid[^"']*["'][^>]*>([\s\S]*?)<\/code><\/pre>/g;

			htmlContent = htmlContent.replace(mermaidRegex, (_match, codeContent: string) => {
				// HTMLタグを除去してテキストコンテンツのみ保持（サニタイズバイパス防止）
				// ネストされたタグによるバイパスを防ぐため、マッチがなくなるまで繰り返す
				let safeCode = codeContent;
				let prev: string;
				do {
					prev = safeCode;
					safeCode = safeCode.replace(/<[^>]*>/g, '');
				} while (safeCode !== prev);
				mermaidBlocks.push(safeCode);
				return `__MERMAID_BLOCK_${mermaidBlocks.length - 1}__`;
			});

			// サニタイズ処理 (DOMPurify)
			// 既存の埋め込み(iframe, script)を維持しつつ、XSSを防ぐための設定
			const window = new Window();
			// @ts-expect-error happy-dom WindowとDOMPurify WindowLike型の互換性問題を回避
			const purify = DOMPurify(window);

			// 許可するタグと属性の設定
			const sanitizeOptions = {
				ADD_TAGS: [
					'iframe',
					'script',
					'ogp-card',
					'blockquote',
					'chatgpt-go-map',
					'pre',
					'code',
					'div',
					'span',
					'p',
					'br',
					// SVG関連タグ（Mermaid図表示に必要）
					'svg',
					'path',
					'g',
					'rect',
					'line',
					'circle',
					'ellipse',
					'polygon',
					'polyline',
					'text',
					'tspan',
					'foreignObject',
					'marker',
					'defs',
					'clipPath',
					'linearGradient',
					'radialGradient',
					'stop',
					'use'
				],
				// foreignObject内のHTML要素を許可
				ALLOW_UNKNOWN_PROTOCOLS: false,
				ALLOW_DATA_ATTR: true,
				FORBID_CONTENTS: [],
				KEEP_CONTENT: true,
				IN_PLACE: false,
				ADD_ATTR: [
					'target',
					'allow',
					'allowfullscreen',
					'frameborder',
					'scrolling',
					'data-url',
					'data-media-max-width', // Twitter widget
					'charset',
					'async',
					'class',
					'id',
					'style', // 必要に応じてスタイル属性も許可（ただしリスクあり、今回は互換性優先）
					// SVG属性（Mermaid図のテキスト表示に必要）
					'x',
					'y',
					'dx',
					'dy',
					'x1',
					'y1',
					'x2',
					'y2',
					'cx',
					'cy',
					'r',
					'rx',
					'ry',
					'width',
					'height',
					'viewBox',
					'xmlns',
					'd', // path data
					'fill',
					'stroke',
					'stroke-width',
					'stroke-dasharray',
					'stroke-linecap',
					'stroke-linejoin',
					'opacity',
					'fill-opacity',
					'stroke-opacity',
					'transform',
					'text-anchor',
					'dominant-baseline',
					'font-size',
					'font-family',
					'font-weight',
					'font-style',
					'points', // polygon/polyline
					'marker-start',
					'marker-end',
					'marker-mid',
					// グラデーション・その他のSVG属性
					'offset',
					'stop-color',
					'stop-opacity',
					'clip-path',
					'href',
					'xlink:href',
					'preserveAspectRatio',
					'gradientUnits',
					'gradientTransform',
					'spreadMethod'
				],
				WHOLE_DOCUMENT: false
			};

			// フックによる厳格なドメインチェック
			purify.addHook('beforeSanitizeAttributes', (currentNode) => {
				if (currentNode.tagName === 'IFRAME' || currentNode.tagName === 'SCRIPT') {
					const src = currentNode.getAttribute('src');
					if (src) {
						const allowedDomains = [
							'youtube.com',
							'www.youtube.com',
							'speakerdeck.com',
							'www.slideshare.net',
							'note.com',
							'platform.twitter.com',
							'www.instagram.com',
							'connect.facebook.net'
						];

						try {
							// 相対パスやプロトコル省略(//)に対応
							const urlToCheck = src.startsWith('//') ? `https:${src}` : src;
							const hostname = new URL(urlToCheck, 'https://example.com').hostname;

							const isAllowed = allowedDomains.some(
								(domain) => hostname === domain || hostname.endsWith(`.${domain}`)
							);

							if (!isAllowed) {
								currentNode.removeAttribute('src');
								console.warn(`Blocked suspicious src: ${src}`);
							}
						} catch {
							currentNode.removeAttribute('src');
						}
					}
				}
			});

			// foreignObject内のHTML要素を保護（Mermaid図のテキスト表示に必要）
			purify.addHook('uponSanitizeElement', (node, data) => {
				// foreignObject要素内の全てのノードを保持
				if (node.parentNode && node.parentNode.nodeName === 'foreignObject') {
					// @ts-expect-error DOMPurify hook uses non-standard forceKeepAttr
					data.forceKeepAttr = true;
					return node;
				}

				// Elementノードのみ対象
				if (node.nodeType !== 1) {
					return node;
				}
				const element = node as unknown as Element;

				// インラインスクリプトをブロック（XSS対策）
				// src属性を持たない<script>タグは削除
				if (node.nodeName === 'SCRIPT' && !element.hasAttribute('src')) {
					return null;
				}

				// src属性のないiframeもブロック（srcdoc経由のXSS対策）
				if (node.nodeName === 'IFRAME' && !element.hasAttribute('src')) {
					return null;
				}
			});
			htmlContent = purify.sanitize(htmlContent, sanitizeOptions);

			// Mermaidブロックを復元（安全なコードテキストから構造を再構築）
			mermaidBlocks.forEach((code, index) => {
				const placeholder = `__MERMAID_BLOCK_${index}__`;
				htmlContent = htmlContent.replace(
					placeholder,
					`<pre><code class="language-mermaid">${code}</code></pre>`
				);
			});

			// メタデータと本文を返す
			let imageUrl = '';

			if (data.image) {
				// imageフィールドが外部URL（http/https）の場合
				if (data.image.startsWith('http://') || data.image.startsWith('https://')) {
					// 画像ファイルの直接URLかチェック
					const isDirectImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(data.image);

					if (isDirectImage) {
						// 画像の直接URLの場合はそのまま使用
						imageUrl = data.image;
					} else {
						// ページURLの場合はOGP画像を取得
						imageUrl = await fetchOgpImage(data.image);
						// OGP画像が取得できなかった場合はフォールバック画像（heroimage1）を使用
						if (!imageUrl) {
							imageUrl = AppConfig.post_string.about;
						}
					}
				} else {
					// 相対パスの場合はそのまま使用
					imageUrl = data.image;
				}
			} else {
				// imageフィールドがない場合はAppConfigから取得、なければフォールバック
				imageUrl = AppConfig.post_string[slug] || AppConfig.post_string.about;
			}

			// メタデータと本文を返す
			return {
				status: 200,
				body: htmlContent,
				metadata: {
					title: data.title || slug,
					date: data.date || '',
					category: data.category || '',
					tags: data.tags || [],
					description: data.description || '',
					image: imageUrl,
					type: data.type || 'blog'
				}
			};
		} catch (err) {
			console.error(`Error processing post ${slug}:`, err);
			throw error(500, `Error processing post: ${slug}`);
		}
	}

	throw error(404, `Post not found: ${slug}`);
};
