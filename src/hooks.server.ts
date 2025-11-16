import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Chrome DevToolsや他のツールが自動的にリクエストする .well-known パスを静かに404で返す
	// これによりコンソールに不要なエラーログが表示されなくなる
	if (event.url.pathname.startsWith('/.well-known/')) {
		return new Response(null, { status: 404 });
	}

	return resolve(event);
};
