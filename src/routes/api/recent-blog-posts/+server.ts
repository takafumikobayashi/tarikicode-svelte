import { getAllPostsMetadata } from '#lib/utils/posts.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	// 全記事を取得
	const allPosts = await getAllPostsMetadata();

	// blogタイプのみフィルタし、最新6件を取得
	const recentBlogPosts = allPosts.filter((post) => post.type === 'blog').slice(0, 6);

	return Response.json({
		posts: recentBlogPosts
	});
};
