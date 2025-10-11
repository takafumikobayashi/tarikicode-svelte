import { json } from '@sveltejs/kit';
import { getAllPostsMetadata } from '$lib/utils/posts';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// 全記事を取得
	const allPosts = getAllPostsMetadata();

	// blogタイプのみフィルタし、最新5件を取得
	const recentBlogPosts = allPosts.filter((post) => post.type === 'blog').slice(0, 5);

	return json({
		posts: recentBlogPosts
	});
};
