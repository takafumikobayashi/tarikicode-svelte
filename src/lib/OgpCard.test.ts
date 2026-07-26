import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/svelte';
import OgpCard from './OgpCard.svelte';

const TARGET_URL = 'https://example.com/article';

function mockJsonResponse(body: unknown, ok = true, status = 200) {
	return Promise.resolve({
		ok,
		status,
		json: () => Promise.resolve(body)
	} as Response);
}

describe('OgpCard', () => {
	beforeEach(() => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.useRealTimers();
	});

	it('OGP取得に成功したらカードを表示する', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() =>
				mockJsonResponse({
					title: 'サンプル記事',
					description: '説明文',
					image: 'https://example.com/ogp.png',
					siteName: 'Example',
					url: TARGET_URL
				})
			)
		);

		render(OgpCard, { props: { url: TARGET_URL } });

		await waitFor(() => expect(screen.getByText('サンプル記事')).toBeInTheDocument());
		expect(screen.getByText('説明文')).toBeInTheDocument();
		expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/ogp.png');
	});

	it('APIがエラーを返し、フォールバック値もない場合はURLのリンクを表示する', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => mockJsonResponse({}, false, 400))
		);

		render(OgpCard, { props: { url: TARGET_URL } });

		await waitFor(() => {
			const link = screen.getByRole('link');
			expect(link).toHaveAttribute('href', TARGET_URL);
			expect(link).toHaveTextContent(TARGET_URL);
		});
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});

	it('APIがエラーでもフォールバック値があればカードを表示する', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() => mockJsonResponse({}, false, 400))
		);

		render(OgpCard, {
			props: {
				url: TARGET_URL,
				fallbackTitle: '手動タイトル',
				fallbackDesc: '手動説明',
				fallbackSite: '手動サイト'
			}
		});

		await waitFor(() => expect(screen.getByText('手動タイトル')).toBeInTheDocument());
		expect(screen.getByText('手動説明')).toBeInTheDocument();
	});

	it('APIが応答しない場合は5秒で打ち切ってリンクにフォールバックする', async () => {
		vi.useFakeTimers();

		// abortされるまで解決しないfetch（応答が返らないAPIを再現）
		vi.stubGlobal(
			'fetch',
			vi.fn(
				(_url: string, init?: RequestInit) =>
					new Promise((_resolve, reject) => {
						init?.signal?.addEventListener('abort', () => {
							reject(new DOMException('Aborted', 'AbortError'));
						});
					})
			)
		);

		render(OgpCard, { props: { url: TARGET_URL } });

		// 打ち切り前は読み込み中のまま
		expect(screen.getByText('読み込み中...')).toBeInTheDocument();

		await vi.advanceTimersByTimeAsync(5000);

		await waitFor(() => {
			expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
			expect(screen.getByRole('link')).toHaveAttribute('href', TARGET_URL);
		});
	});

	it('HTMLエンティティを含む値をデコードして表示する', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() =>
				mockJsonResponse({
					title: 'A &amp; B',
					description: '',
					image: '',
					siteName: '',
					url: TARGET_URL
				})
			)
		);

		render(OgpCard, { props: { url: TARGET_URL } });

		await waitFor(() => expect(screen.getByText('A & B')).toBeInTheDocument());
	});

	// 実際のページは <ogp-card> プレースホルダへ imperative にマウントするため、
	// その経路も固定しておく
	it('<ogp-card>へimperativeにマウントしても描画・破棄できる', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() =>
				mockJsonResponse({
					title: 'マウント確認',
					description: '',
					image: '',
					siteName: '',
					url: TARGET_URL
				})
			)
		);

		document.body.innerHTML = `<div><ogp-card data-url="${TARGET_URL}"></ogp-card></div>`;
		const card = document.querySelector('ogp-card') as HTMLElement;

		card.innerHTML = '';
		const instance = new OgpCard({
			target: card,
			props: { url: card.getAttribute('data-url') ?? '' }
		});

		expect(card.textContent).toContain('読み込み中');
		await waitFor(() => expect(card.textContent).toContain('マウント確認'));

		instance.$destroy();
		expect(card.textContent).not.toContain('マウント確認');
		document.body.innerHTML = '';
	});

	it('破棄すると進行中のリクエストを中断し、警告も出さない', async () => {
		const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
		let capturedSignal: AbortSignal | undefined;

		vi.stubGlobal(
			'fetch',
			vi.fn(
				(_url: string, init?: RequestInit) =>
					new Promise((_resolve, reject) => {
						capturedSignal = init?.signal ?? undefined;
						init?.signal?.addEventListener('abort', () => {
							reject(new DOMException('Aborted', 'AbortError'));
						});
					})
			)
		);

		document.body.innerHTML = `<div><ogp-card data-url="${TARGET_URL}"></ogp-card></div>`;
		const card = document.querySelector('ogp-card') as HTMLElement;
		const instance = new OgpCard({ target: card, props: { url: TARGET_URL } });

		expect(capturedSignal?.aborted).toBe(false);

		instance.$destroy();

		expect(capturedSignal?.aborted).toBe(true);
		// 離脱に伴う中断は異常ではないので警告を出さない
		await waitFor(() => expect(warn).not.toHaveBeenCalled());
		document.body.innerHTML = '';
	});

	it('画像の読み込みに失敗したら画像枠を隠してテキストだけ表示する', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() =>
				mockJsonResponse({
					title: 'タイトルあり',
					description: '',
					image: 'https://example.com/blocked.png',
					siteName: '',
					url: TARGET_URL
				})
			)
		);

		render(OgpCard, { props: { url: TARGET_URL } });

		const img = await screen.findByRole('img');
		expect(img).toBeInTheDocument();

		// 配信元がCORP等で埋め込みを拒否した場合を再現
		await img.dispatchEvent(new Event('error'));

		await waitFor(() => expect(screen.queryByRole('img')).not.toBeInTheDocument());
		expect(screen.getByText('タイトルあり')).toBeInTheDocument();
	});

	it('http(s)以外のスキームの画像URLは描画しない', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(() =>
				mockJsonResponse({
					title: 'タイトル',
					description: '',
					image: 'javascript:alert(1)',
					siteName: '',
					url: TARGET_URL
				})
			)
		);

		render(OgpCard, { props: { url: TARGET_URL } });

		await waitFor(() => expect(screen.getByText('タイトル')).toBeInTheDocument());
		expect(screen.queryByRole('img')).not.toBeInTheDocument();
	});
});
