// SvelteKit 3で$service-workerは廃止され、$app/env・$app/manifest・$app/pathsに分割された
import { version } from '$app/env';
import { assets } from '$app/manifest';
import { asset } from '$app/paths';

// 開発環境かどうかを判定 (Viteによって置換される)
const isDev = import.meta.env.DEV;

if (isDev) {
	// 開発環境ではService Workerを無効化（即座にスキップ）
	self.addEventListener('install', () => self.skipWaiting());
	self.addEventListener('activate', () => self.clients.claim());
	// fetchイベントリスナーを登録しないことで、すべてのリクエストをネットワークに流す
} else {
	const CACHE = `cache-${version}`;
	// 事前キャッシュはstaticディレクトリのファイルだけにする。
	// Viteの出力（$app/manifestのimmutable）には遅延ロード前提のmermaidやアイコンパック等も
	// 含まれ合計20MB超になるため、初回訪問時にまとめて取得すると通信量が大きすぎる。
	// _app/配下はfetchハンドラーでキャッシュ優先＋取得時に保存しているので、
	// 実際に閲覧したページのチャンクは自然にキャッシュされる
	// ドットファイル（macOSの.DS_Store等）は配信されず404になることが多い。
	// cache.addAll は1件でも失敗すると全体が失敗し、Service Workerがインストールされないため除外する
	const ASSETS = assets
		.filter((file) => !file.path.split('/').some((segment) => segment.startsWith('.')))
		.map((file) => asset(file.path));

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
}
