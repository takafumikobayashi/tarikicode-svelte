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

function createElement(top: number): HTMLElement {
	const el = document.createElement('div');
	document.body.appendChild(el);
	el.getBoundingClientRect = () =>
		({ top, bottom: top + 100, left: 0, right: 0, width: 0, height: 100 }) as DOMRect;
	return el;
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
		expect(el.classList.contains('reveal')).toBe(false);
		expect(FakeIntersectionObserver.instances).toHaveLength(0);
	});

	it('画面外の要素は隠し、交差したら表示して監視をやめる', async () => {
		const reveal = await loadReveal();
		const el = createElement(1200);
		reveal(el);
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
		expect(FakeIntersectionObserver.instances).toHaveLength(1);
		expect(FakeIntersectionObserver.instances[0].observed.size).toBe(2);
	});

	it('delayを指定するとCSS変数に反映される', async () => {
		const reveal = await loadReveal();
		const el = createElement(1200);
		reveal(el, { delay: 200 });
		expect(el.style.getPropertyValue('--reveal-delay')).toBe('200ms');
	});

	it('prefers-reduced-motionが有効なら何もしない', async () => {
		mockMatchMedia(true);
		const reveal = await loadReveal();
		const el = createElement(1200);
		reveal(el);
		expect(el.classList.contains('reveal')).toBe(false);
	});

	it('destroyで監視を解除する', async () => {
		const reveal = await loadReveal();
		const el = createElement(1200);
		const action = reveal(el);
		action.destroy?.();
		expect(FakeIntersectionObserver.instances[0].observed.has(el)).toBe(false);
	});
});
