import { version, files, build } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}
	event.waitUntil(addFilesToCache());
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
	}
	event.waitUntil(deleteOldCaches());
	self.clients.claim();
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	// `chrome-extension://` スキームのリクエストを無視する
	if (event.request.url.startsWith('chrome-extension://')) {
		return;
	}

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// CloudFront画像の場合はネットワーク優先、フォールバックでキャッシュ
		if (url.hostname === 'd1mt09hgbl7gpz.cloudfront.net') {
			try {
				const response = await fetch(event.request);
				if (response.status === 200) {
					cache.put(event.request, response.clone());
				}
				return response;
			} catch {
				const cachedResponse = await cache.match(event.request);
				if (cachedResponse) return cachedResponse;
				throw new Error('Network failed and no cache available');
			}
		}

		// ビルドアセット（_app/内のファイル）の場合はキャッシュ優先
		if (url.pathname.startsWith('/_app/')) {
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) return cachedResponse;
		}

		// その他のリクエストはネットワーク優先、キャッシュをフォールバックとして使用
		try {
			const response = await fetch(event.request);
			// 成功したレスポンスで、HTML/CSS/JSファイルの場合のみキャッシュ
			if (response.status === 200) {
				const contentType = response.headers.get('content-type') || '';
				if (
					contentType.includes('text/html') ||
					contentType.includes('text/css') ||
					contentType.includes('application/javascript') ||
					url.pathname.startsWith('/_app/')
				) {
					cache.put(event.request, response.clone());
				}
			}
			return response;
		} catch {
			const cachedResponse = await cache.match(event.request);
			if (cachedResponse) return cachedResponse;
			throw new Error('Network failed and no cache available');
		}
	}
	event.respondWith(respond());
});
