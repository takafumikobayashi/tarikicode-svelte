import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAllPostsMetadata } from './posts';
import { AppConfig } from '#lib/AppConfig.js';

describe('getAllPostsMetadata の外部OGP取得', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('外部サイトへの取得はすべて期限付きのsignalを渡す', async () => {
		const signals: (AbortSignal | null | undefined)[] = [];
		vi.stubGlobal(
			'fetch',
			vi.fn((_url: string, init?: RequestInit) => {
				signals.push(init?.signal);
				return Promise.resolve(new Response('<html></html>', { status: 200 }));
			})
		);

		await getAllPostsMetadata();

		// 記事のimage欄にページURLが書かれた記事があれば取得が発生する
		expect(signals.length).toBeGreaterThan(0);
		expect(signals.every((s) => s instanceof AbortSignal)).toBe(true);
	});

	it('取得が中断（タイムアウト）されても一覧は返り、既定の画像が使われる', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => Promise.reject(new DOMException('timed out', 'TimeoutError')))
		);
		const error = vi.spyOn(console, 'error').mockImplementation(() => {});

		const posts = await getAllPostsMetadata();

		expect(posts.length).toBeGreaterThan(0);
		expect(posts.every((p) => typeof p.image === 'string' && p.image.length > 0)).toBe(true);
		expect(posts.some((p) => p.image === AppConfig.post_string.about)).toBe(true);
		error.mockRestore();
	});

	it('resolveImages: false なら外部取得をしない', async () => {
		const fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);

		await getAllPostsMetadata({ resolveImages: false });

		expect(fetchMock).not.toHaveBeenCalled();
	});
});
