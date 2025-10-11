// src/routes/blog/[slug]/+page.server.ts
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params;

	// 複数のパスを試行（互換性のため）
	const possiblePaths = [
		path.resolve('src/posts', `${slug}.md`),
		path.resolve('src/posts/blog', `${slug}.md`),
		path.resolve('src/posts/works', `${slug}.md`)
	];

	for (const filePath of possiblePaths) {
		if (fs.existsSync(filePath)) {
			try {
				const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
				const { data, content } = matter(fileContent);

				// MarkdownをHTMLに変換
				const htmlContent = marked(content);

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
						image: data.image || '',
						type: data.type || 'blog'
					}
				};
			} catch (err) {
				console.error(`Error reading file ${filePath}:`, err);
				throw error(500, `Error reading post: ${slug}`);
			}
		}
	}

	throw error(404, `Post not found: ${slug}`);
};
