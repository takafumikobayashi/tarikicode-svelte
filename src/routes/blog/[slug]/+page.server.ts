// src/routes/blog/[slug]/+page.server.ts
import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { AppConfig } from '$lib/AppConfig';

// 外部URLからOGP画像を取得するヘルパー関数
async function fetchOgpImage(url: string): Promise<string> {
	try {
		const response = await fetch(url);
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
	} catch (err) {
		console.error(`Error fetching OGP image from ${url}:`, err);
		return '';
	}
}

export const load = async ({ params }: { params: { slug: string } }) => {
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
				const processedContent = content.replace(
					/\[\[ogp:(https?:\/\/[^\]]+)\]\]/g,
					(match, url) => {
						// HTMLコメントで囲んでmarkedが処理しないようにする
						return `\n\n<ogp-card data-url="${url}"></ogp-card>\n\n`;
					}
				);

				// MarkdownをHTMLに変換
				let htmlContent = marked(processedContent) as string;

				// 画像URLの取得ロジック
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
				console.error(`Error reading file ${filePath}:`, err);
				throw error(500, `Error reading post: ${slug}`);
			}
		}
	}

	throw error(404, `Post not found: ${slug}`);
};
