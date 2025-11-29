import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Chrome DevToolsや他のツールが自動的にリクエストする .well-known パスを静かに404で返す
	// これによりコンソールに不要なエラーログが表示されなくなる
	if (event.url.pathname.startsWith('/.well-known/')) {
		return new Response(null, { status: 404 });
	}

	const response = await resolve(event);

	// セキュリティヘッダーの追加
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-XSS-Protection', '1; mode=block');

	// 本番環境のみHSTSを有効化 (ローカル開発でのトラブル防止)
	if (process.env.NODE_ENV === 'production') {
		response.headers.set(
			'Strict-Transport-Security',
			'max-age=31536000; includeSubDomains; preload'
		);
	}

	return response;
};
