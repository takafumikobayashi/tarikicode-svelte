import { Marked } from 'marked';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';

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
		const htmlContent = markedInstance.parse(content) as string;

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
