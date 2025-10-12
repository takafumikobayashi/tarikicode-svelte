import { getAllPostsMetadata } from '$lib/utils/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	// 全記事のメタデータを取得
	const allPosts = await getAllPostsMetadata();

	// URLパラメータから取得
	const category = url.searchParams.get('category');
	const tag = url.searchParams.get('tag');
	const type = url.searchParams.get('type') as 'blog' | 'work' | null;
	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = 12;

	// フィルタリング
	let filteredPosts = allPosts;

	// typeでフィルタ（指定がない場合はblogのみ）
	if (type) {
		filteredPosts = filteredPosts.filter((p) => p.type === type);
	} else {
		filteredPosts = filteredPosts.filter((p) => p.type === 'blog');
	}

	// カテゴリでフィルタ
	if (category) {
		filteredPosts = filteredPosts.filter((p) => p.category === category);
	}

	// タグでフィルタ
	if (tag) {
		filteredPosts = filteredPosts.filter((p) => p.tags.includes(tag));
	}

	// ページネーション
	const totalPages = Math.ceil(filteredPosts.length / perPage);
	const paginatedPosts = filteredPosts.slice((page - 1) * perPage, page * perPage);

	// ブログ記事のみのカテゴリとタグの一覧を取得
	const blogPosts = allPosts.filter((p) => p.type === 'blog');
	const categories = [...new Set(blogPosts.map((p) => p.category))].sort();
	const tags = [...new Set(blogPosts.flatMap((p) => p.tags))].sort();

	return {
		posts: paginatedPosts,
		categories,
		tags,
		currentPage: page,
		totalPages,
		totalPosts: filteredPosts.length,
		selectedCategory: category,
		selectedTag: tag,
		selectedType: type
	};
};
