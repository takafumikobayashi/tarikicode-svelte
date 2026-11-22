import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import PostFooter from './PostFooter.svelte';

const PATH = '/blog/test-post';
const LAMBDA_URL = 'https://lambda.example.test/';

const jsonResponse = (body: unknown, status = 200) =>
	Promise.resolve(new Response(JSON.stringify(body), { status }));

const clearCookies = () => {
	for (const cookie of document.cookie.split(';')) {
		const name = cookie.split('=')[0].trim();
		if (name) document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	}
};

const renderFooter = () => render(PostFooter, { props: { url: PATH, title: 'Test' } });
const likeButton = (container: HTMLElement) => container.querySelector('button.mdc-fab')!;

describe('PostFooter（いいね）', () => {
	let fetchMock: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.stubEnv('VITE_LAMBDA_SERVER_URL', LAMBDA_URL);
		window.history.replaceState({}, '', PATH);
		localStorage.clear();
		clearCookies();
		fetchMock = vi.fn();
		vi.stubGlobal('fetch', fetchMock);
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.unstubAllEnvs();
		vi.unstubAllGlobals();
		vi.restoreAllMocks();
	});

	it('記録のないページは0を表示し、initialize を送らない', async () => {
		fetchMock.mockReturnValueOnce(jsonResponse({ url: PATH, likes: 0, last_updated: null }));
		const { findByText } = renderFooter();

		// 初期表示も0なので、取得した数がキャッシュされるまで待ってから確かめる
		await waitFor(() => expect(localStorage.getItem(`likes_${PATH}`)).toBe('0'));
		expect(await findByText('Likes: 0')).toBeTruthy();
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock.mock.calls[0][0]).toBe(`${LAMBDA_URL}?url=${encodeURIComponent(PATH)}`);
	});

	it('押すとサーバーが返した数を表示し、Cookie を保存していいね済みにする', async () => {
		fetchMock
			.mockReturnValueOnce(jsonResponse({ likes: 3, last_updated: '2026-01-01T00:00:00Z' }))
			.mockReturnValueOnce(jsonResponse({ likes: 7, last_updated: '2026-01-02T00:00:00Z' }));
		const { container, findByText } = renderFooter();
		await findByText('Likes: 3');

		await fireEvent.click(likeButton(container));

		// 手元で+1した4ではなく、サーバーの7を表示する（その間に他の人が押していた場合）
		expect(await findByText('Likes: 7')).toBeTruthy();
		expect(JSON.parse(fetchMock.mock.calls[1][1].body)).toEqual({ type: 'update', url: PATH });
		expect(document.cookie).toContain(`liked_${PATH}=true`);
		expect(localStorage.getItem(`likes_${PATH}`)).toBe('7');
		expect(likeButton(container)).toBeDisabled();
	});

	it('alreadyLiked のときは数を増やさず、いいね済みにする', async () => {
		fetchMock
			.mockReturnValueOnce(jsonResponse({ likes: 5, last_updated: '2026-01-01T00:00:00Z' }))
			.mockReturnValueOnce(jsonResponse({ likes: 5, alreadyLiked: true }));
		const { container, findByText } = renderFooter();
		await findByText('Likes: 5');

		await fireEvent.click(likeButton(container));

		await waitFor(() => expect(likeButton(container)).toBeDisabled());
		expect(await findByText('Likes: 5')).toBeTruthy();
		expect(document.cookie).toContain(`liked_${PATH}=true`);
	});

	it('サーバーが拒否したら表示を変えず、ボタンも押せるままにする', async () => {
		fetchMock
			.mockReturnValueOnce(jsonResponse({ likes: 2, last_updated: '2026-01-01T00:00:00Z' }))
			.mockReturnValueOnce(jsonResponse({ message: 'Bad Request: Unknown page' }, 400));
		const { container, findByText } = renderFooter();
		await findByText('Likes: 2');

		await fireEvent.click(likeButton(container));

		await waitFor(() => expect(console.error).toHaveBeenCalled());
		expect(await findByText('Likes: 2')).toBeTruthy();
		expect(document.cookie).not.toContain(`liked_${PATH}`);
		expect(likeButton(container)).not.toBeDisabled();
	});

	it('Cookie があれば最初からいいね済みで、押しても送信しない', async () => {
		document.cookie = `liked_${PATH}=true;path=/`;
		fetchMock.mockReturnValueOnce(
			jsonResponse({ likes: 4, last_updated: '2026-01-01T00:00:00Z' })
		);
		const { container, findByText } = renderFooter();
		await findByText('Likes: 4');

		await waitFor(() => expect(likeButton(container)).toBeDisabled());
		await fireEvent.click(likeButton(container));
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
