import { json } from '@sveltejs/kit';
import { getAllPostsMetadata } from '$lib/utils/posts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const allPosts = await getAllPostsMetadata();

	// URLパラメータから取得
	const category = url.searchParams.get('category');
	const tag = url.searchParams.get('tag');
	const type = url.searchParams.get('type') as 'blog' | 'work' | null;
	const offset = parseInt(url.searchParams.get('offset') || '0');
	const limit = parseInt(url.searchParams.get('limit') || '12');

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

	// offset/limit でページング
	const paginatedPosts = filteredPosts.slice(offset, offset + limit);
	const hasMore = offset + limit < filteredPosts.length;

	return json({
		posts: paginatedPosts,
		hasMore,
		total: filteredPosts.length
	});
};
