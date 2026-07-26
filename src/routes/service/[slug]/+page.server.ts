import { Marked } from 'marked';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import { Window } from 'happy-dom';
import DOMPurify from 'dompurify';

// HTML属性値をエスケープするヘルパー（ogp-card属性の二重引用符破壊を防ぐ）
function escapeAttr(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

const posts = import.meta.glob('/src/posts/service/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
});

export const load = async ({ params }: { params: { slug: string } }) => {
	const { slug } = params;

	const path = `/src/posts/service/${slug}.md`;
	const fileContent = posts[path] as string | undefined;

	if (!fileContent) {
		throw error(404, `Service not found: ${slug}`);
	}

	try {
		const { data, content } = matter(fileContent);

		// OGPカード記法を事前変換（blog側と同一仕様）
		const processedContent = content.replace(
			// 構文: [[ogp:URL|画像|タイトル|説明|サイト名]] （各フィールドは省略可、空欄は||で飛ばす）
			/\[\[ogp:(https?:\/\/[^\]|]+)(?:\|([^\]|]*))?(?:\|([^\]|]*))?(?:\|([^\]|]*))?(?:\|([^\]|]*))?\]\]/g,
			(match, url, fallbackImage, fallbackTitle, fallbackDesc, fallbackSite) => {
				const imageAttr = fallbackImage
					? ` data-fallback-image="${escapeAttr(fallbackImage)}"`
					: '';
				const titleAttr = fallbackTitle
					? ` data-fallback-title="${escapeAttr(fallbackTitle)}"`
					: '';
				const descAttr = fallbackDesc ? ` data-fallback-desc="${escapeAttr(fallbackDesc)}"` : '';
				const siteAttr = fallbackSite ? ` data-fallback-site="${escapeAttr(fallbackSite)}"` : '';
				return `\n\n<ogp-card data-url="${escapeAttr(url)}"${imageAttr}${titleAttr}${descAttr}${siteAttr}></ogp-card>\n\n`;
			}
		);

		const markedInstance = new Marked();
		const parsedHtml = markedInstance.parse(processedContent) as string;

		// Mermaidブロックを退避（コードテキストのみ保存し復元時に構造を再構築）
		const mermaidBlocks: string[] = [];
		const mermaidRegex =
			/<pre><code[^>]*class=["'][^"']*mermaid[^"']*["'][^>]*>([\s\S]*?)<\/code><\/pre>/g;
		const htmlForSanitize = parsedHtml.replace(mermaidRegex, (_match, codeContent: string) => {
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

		// DOMPurifyでサニタイズ（サービスページはiframe/script不要のため厳格設定）
		const window = new Window();
		// @ts-expect-error happy-dom WindowとDOMPurify WindowLike型の互換性問題を回避
		const purify = DOMPurify(window);

		let htmlContent = purify.sanitize(htmlForSanitize, {
			ALLOWED_TAGS: [
				'h1',
				'h2',
				'h3',
				'h4',
				'h5',
				'h6',
				'p',
				'br',
				'hr',
				'ul',
				'ol',
				'li',
				'a',
				'strong',
				'em',
				'code',
				'pre',
				'blockquote',
				'table',
				'thead',
				'tbody',
				'tr',
				'th',
				'td',
				'img',
				'div',
				'span',
				'del',
				'ogp-card'
			],
			ALLOWED_ATTR: [
				'href',
				'target',
				'rel',
				'src',
				'alt',
				'width',
				'height',
				'class',
				'id',
				// ogp-card用（ALLOW_DATA_ATTRがfalseなので個別に許可する）
				'data-url',
				'data-fallback-image',
				'data-fallback-title',
				'data-fallback-desc',
				'data-fallback-site'
			],
			ALLOW_DATA_ATTR: false
		});

		// Mermaidブロックを復元（安全なコードテキストから構造を再構築）
		mermaidBlocks.forEach((code, index) => {
			htmlContent = htmlContent.replace(
				`__MERMAID_BLOCK_${index}__`,
				`<pre><code class="language-mermaid">${code}</code></pre>`
			);
		});

		return {
			body: htmlContent,
			metadata: {
				title: data.title || slug,
				description: data.description || '',
				image: data.image || '',
				service_url: data.service_url || '',
				label: data.label || '',
				type: data.type || 'service'
			}
		};
	} catch (err) {
		console.error(`Error processing service page ${slug}:`, err);
		throw error(500, `Error processing service page: ${slug}`);
	}
};
