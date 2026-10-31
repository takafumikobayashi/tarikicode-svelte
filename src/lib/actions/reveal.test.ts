import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// テスト用のIntersectionObserver。コールバックを手動で発火できるようにする
class FakeIntersectionObserver {
	static instances: FakeIntersectionObserver[] = [];
	observed = new Set<Element>();
	constructor(public callback: IntersectionObserverCallback) {
		FakeIntersectionObserver.instances.push(this);
	}
	observe(el: Element) {
		this.observed.add(el);
	}
	unobserve(el: Element) {
		this.observed.delete(el);
	}
	disconnect() {
		this.observed.clear();
	}
	trigger(el: Element, isIntersecting: boolean) {
		this.callback(
			[{ target: el, isIntersecting } as IntersectionObserverEntry],
			this as unknown as IntersectionObserver
		);
	}
}

function mockMatchMedia(reducedMotion: boolean) {
	vi.stubGlobal(
		'matchMedia',
		vi.fn((query: string) => ({
			matches: query.includes('reduce') ? reducedMotion : false,
			media: query
		}))
	);
}

function createElement(initialTop: number) {
	const el = document.createElement('div');
	document.body.appendChild(el);
	let top = initialTop;
	el.getBoundingClientRect = () =>
		({ top, bottom: top + 100, left: 0, right: 0, width: 0, height: 100 }) as DOMRect;
	// スクロール位置の変化（復元）を再現するため、後から位置を変えられるようにする
	return Object.assign(el, { setTop: (value: number) => (top = value) });
}

// requestAnimationFrameを手動で進められるようにする
let frameQueue: FrameRequestCallback[] = [];
function flushFrames() {
	const queue = frameQueue;
	frameQueue = [];
	queue.forEach((cb) => cb(0));
}

// モジュール内でObserverを共有しているため、テストごとに読み込み直す
async function loadReveal() {
	vi.resetModules();
	return (await import('./reveal')).reveal;
}

describe('reveal アクション', () => {
	beforeEach(() => {
		FakeIntersectionObserver.instances = [];
		vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
		vi.stubGlobal('innerHeight', 800);
		frameQueue = [];
		vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
			frameQueue.push(cb);
			return frameQueue.length;
		});
		vi.stubGlobal('cancelAnimationFrame', (id: number) => {
			frameQueue[id - 1] = () => {};
		});
		mockMatchMedia(false);
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		document.body.innerHTML = '';
	});

	it('マウント時に画面内にある要素は隠さない（ファーストビューを守る）', async () => {
		const reveal = await loadReveal();
		const el = createElement(100);
		reveal(el);
		flushFrames();
		expect(el.classList.contains('reveal')).toBe(false);
		expect(FakeIntersectionObserver.instances).toHaveLength(0);
	});

	it('画面外の要素は隠し、交差したら表示して監視をやめる', async () => {
		const reveal = await loadReveal();
		const el = createElement(1200);
		reveal(el);
		flushFrames();
		expect(el.classList.contains('reveal')).toBe(true);
		expect(el.classList.contains('reveal--visible')).toBe(false);

		const observer = FakeIntersectionObserver.instances[0];
		observer.trigger(el, false);
		expect(el.classList.contains('reveal--visible')).toBe(false);

		observer.trigger(el, true);
		expect(el.classList.contains('reveal--visible')).toBe(true);
		expect(observer.observed.has(el)).toBe(false);
	});

	it('複数要素でもIntersectionObserverは1つだけ作る', async () => {
		const reveal = await loadReveal();
		reveal(createElement(1200));
		reveal(createElement(1500));
		flushFrames();
		expect(FakeIntersectionObserver.instances).toHaveLength(1);
		expect(FakeIntersectionObserver.instances[0].observed.size).toBe(2);
	});

	it('delayを指定するとCSS変数に反映される', async () => {
		const reveal = await loadReveal();
		const el = createElement(1200);
		reveal(el, { delay: 200 });
		flushFrames();
		expect(el.style.getPropertyValue('--reveal-delay')).toBe('200ms');
	});

	it('prefers-reduced-motionが有効なら何もしない', async () => {
		mockMatchMedia(true);
		const reveal = await loadReveal();
		const el = createElement(1200);
		reveal(el);
		flushFrames();
		expect(el.classList.contains('reveal')).toBe(false);
	});

	it('destroyで監視を解除する', async () => {
		const reveal = await loadReveal();
		const el = createElement(1200);
		const action = reveal(el);
		flushFrames();
		action.destroy?.();
		expect(FakeIntersectionObserver.instances[0].observed.has(el)).toBe(false);
	});

	it('描画前にdestroyされたら何もしない', async () => {
		const reveal = await loadReveal();
		const el = createElement(1200);
		const action = reveal(el);
		action.destroy?.();
		flushFrames();
		expect(el.classList.contains('reveal')).toBe(false);
	});

	it('マウント後・描画前にスクロール位置が復元されて画面内に来た要素は隠さない（戻る操作）', async () => {
		const reveal = await loadReveal();
		// マウント時点ではページ先頭にいるため画面外に見える
		const el = createElement(1600);
		reveal(el);
		// SvelteKitがスクロール位置を復元し、要素が画面内に来る
		el.setTop(200);
		flushFrames();
		expect(el.classList.contains('reveal')).toBe(false);
	});
});
