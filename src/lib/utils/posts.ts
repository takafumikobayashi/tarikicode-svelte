import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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

/**
 * 全記事のメタデータを取得（本文は読み込まない）
 */
export function getAllPostsMetadata(): PostMetadata[] {
	const postsDir = path.resolve('src/posts');

	if (!fs.existsSync(postsDir)) {
		return [];
	}

	const files = fs.readdirSync(postsDir, { recursive: true, encoding: 'utf-8' });

	const posts = (files as string[])
		.filter((file) => file.endsWith('.md'))
		.map((file) => {
			const fullPath = path.join(postsDir, file);
			const fileContent = fs.readFileSync(fullPath, 'utf-8');

			// gray-matterでフロントマターのみ抽出
			const { data } = matter(fileContent);

			// ファイルパスからslugを生成（サブディレクトリ対応）
			const baseSlug = path.basename(file, '.md');

			return {
				slug: baseSlug,
				title: data.title || baseSlug,
				date: data.date || '',
				category: data.category || 'その他',
				tags: data.tags || [],
				description: data.description || '',
				image: data.image || '',
				featured: data.featured || false,
				type: data.type || 'blog'
			} as PostMetadata;
		});

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
export function getAllCategories(): string[] {
	const posts = getAllPostsMetadata();
	const categories = [...new Set(posts.map((p) => p.category))];
	return categories.sort();
}

/**
 * タグ一覧を取得
 */
export function getAllTags(): string[] {
	const posts = getAllPostsMetadata();
	const tags = [...new Set(posts.flatMap((p) => p.tags))];
	return tags.sort();
}

/**
 * カテゴリでフィルタリング
 */
export function getPostsByCategory(category: string): PostMetadata[] {
	return getAllPostsMetadata().filter((p) => p.category === category);
}

/**
 * タグでフィルタリング
 */
export function getPostsByTag(tag: string): PostMetadata[] {
	return getAllPostsMetadata().filter((p) => p.tags.includes(tag));
}

/**
 * typeでフィルタリング
 */
export function getPostsByType(type: 'blog' | 'work'): PostMetadata[] {
	return getAllPostsMetadata().filter((p) => p.type === type);
}

/**
 * featuredな記事を取得
 */
export function getFeaturedPosts(): PostMetadata[] {
	return getAllPostsMetadata().filter((p) => p.featured);
}
