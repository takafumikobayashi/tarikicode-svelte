import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { AppConfig } from '$lib/AppConfig';

export interface PostMetadata {
	slug: string;
	title: string;
	date: string;
	category: string;
	tags: string[];
	description: string;
	image: string;
	featured: boolean;
	type: 'blog' | 'work';
}

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

/**
 * 全記事のメタデータを取得（本文は読み込まない）
 */
export async function getAllPostsMetadata(): Promise<PostMetadata[]> {
	const postsDir = path.resolve('src/posts');

	if (!fs.existsSync(postsDir)) {
		return [];
	}

	const files = fs.readdirSync(postsDir, { recursive: true, encoding: 'utf-8' });

	const postsPromises = (files as string[])
		.filter((file) => file.endsWith('.md'))
		.map(async (file) => {
			const fullPath = path.join(postsDir, file);
			const fileContent = fs.readFileSync(fullPath, 'utf-8');

			// gray-matterでフロントマターのみ抽出
			const { data } = matter(fileContent);

			// ファイルパスからslugを生成（サブディレクトリ対応）
			const baseSlug = path.basename(file, '.md');

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
				imageUrl = AppConfig.post_string[baseSlug] || AppConfig.post_string.about;
			}

			return {
				slug: baseSlug,
				title: data.title || baseSlug,
				date: data.date || '',
				category: data.category || 'その他',
				tags: data.tags || [],
				description: data.description || '',
				image: imageUrl,
				featured: data.featured || false,
				type: data.type || 'blog'
			} as PostMetadata;
		});

	const posts = await Promise.all(postsPromises);

	// 日付でソート（新しい順）
	return posts.sort((a, b) => {
		if (!a.date) return 1;
		if (!b.date) return -1;
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
}

/**
 * カテゴリ一覧を取得
 */
export async function getAllCategories(): Promise<string[]> {
	const posts = await getAllPostsMetadata();
	const categories = [...new Set(posts.map((p) => p.category))];
	return categories.sort();
}

/**
 * タグ一覧を取得
 */
export async function getAllTags(): Promise<string[]> {
	const posts = await getAllPostsMetadata();
	const tags = [...new Set(posts.flatMap((p) => p.tags))];
	return tags.sort();
}

/**
 * カテゴリでフィルタリング
 */
export async function getPostsByCategory(category: string): Promise<PostMetadata[]> {
	const posts = await getAllPostsMetadata();
	return posts.filter((p) => p.category === category);
}

/**
 * タグでフィルタリング
 */
export async function getPostsByTag(tag: string): Promise<PostMetadata[]> {
	const posts = await getAllPostsMetadata();
	return posts.filter((p) => p.tags.includes(tag));
}

/**
 * typeでフィルタリング
 */
export async function getPostsByType(type: 'blog' | 'work'): Promise<PostMetadata[]> {
	const posts = await getAllPostsMetadata();
	return posts.filter((p) => p.type === type);
}

/**
 * featuredな記事を取得
 */
export async function getFeaturedPosts(): Promise<PostMetadata[]> {
	const posts = await getAllPostsMetadata();
	return posts.filter((p) => p.featured);
}
