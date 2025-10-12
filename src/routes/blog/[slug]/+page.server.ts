// src/routes/blog/[slug]/+page.server.ts
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AppConfig } from '$lib/AppConfig';

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

				// OGPカード記法を事前変換（marked処理前に置き換え）
				const processedContent = content.replace(/\[\[ogp:(https?:\/\/[^\]]+)\]\]/g, (match, url) => {
					// HTMLコメントで囲んでmarkedが処理しないようにする
					return `\n\n<ogp-card data-url="${url}"></ogp-card>\n\n`;
				});

				// MarkdownをHTMLに変換
				let htmlContent = marked(processedContent) as string;

				// AppConfigから画像URLを取得（フォールバック: マークダウンのimageフィールド）
				const imageUrl = data.image || AppConfig.post_string[slug] || '';

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
				console.error(`Error reading file ${filePath}:`, err);
				throw error(500, `Error reading post: ${slug}`);
			}
		}
	}

	throw error(404, `Post not found: ${slug}`);
};
