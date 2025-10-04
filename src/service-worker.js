import { version, files, build } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [...build, ...files];

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}
	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		for (const key of await caches.keys()) if (key !== CACHE) await caches.delete(key);
	}
	event.waitUntil(deleteOldCaches());
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

		// ビルドアセットの場合はキャッシュ優先
		if (ASSETS.includes(url.pathname)) return cache.match(event.request);

		// その他のリクエストはネットワーク優先
		try {
			const response = await fetch(event.request);
			if (response.status === 200) cache.put(event.request, response.clone());
			return response;
		} catch {
			return cache.match(event.request);
		}
	}
	event.respondWith(respond());
});
