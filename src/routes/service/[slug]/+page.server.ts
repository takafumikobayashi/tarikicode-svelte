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

		const markedInstance = new Marked();
		const rawHtml = markedInstance.parse(content) as string;

		// DOMPurifyでサニタイズ（サービスページはiframe/script不要のため厳格設定）
		const window = new Window();
		// @ts-expect-error happy-dom WindowとDOMPurify WindowLike型の互換性問題を回避
		const purify = DOMPurify(window);

		const htmlContent = purify.sanitize(rawHtml, {
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
				'del'
			],
			ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'class', 'id'],
			ALLOW_DATA_ATTR: false
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
