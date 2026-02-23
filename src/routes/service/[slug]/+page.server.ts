import { Marked } from 'marked';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import { Window } from 'happy-dom';
import DOMPurify from 'dompurify';

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

		// OGPカード記法を事前変換
		const processedContent = content.replace(
			/\[\[ogp:(https?:\/\/[^\]]+)\]\]/g,
			(_match, url) => `\n\n<ogp-card data-url="${url}"></ogp-card>\n\n`
		);

		const markedInstance = new Marked();
		const parsedHtml = markedInstance.parse(processedContent) as string;

		// Mermaidブロックを退避（コードテキストのみ保存し復元時に構造を再構築）
		const mermaidBlocks: string[] = [];
		const mermaidRegex =
			/<pre><code[^>]*class=["'][^"']*mermaid[^"']*["'][^>]*>([\s\S]*?)<\/code><\/pre>/g;
		const htmlForSanitize = parsedHtml.replace(mermaidRegex, (_match, codeContent: string) => {
			// HTMLタグを除去してテキストコンテンツのみ保持（サニタイズバイパス防止）
			const safeCode = codeContent.replace(/<[^>]*>/g, '');
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
				'data-url'
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
