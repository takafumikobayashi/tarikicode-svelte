/**
 * スクロールリビール（画面に入った要素をフェードアップで表示する）Svelteアクション。
 *
 * 使い方: <div use:reveal> / <div use:reveal={{ delay: 100 }}>
 *
 * 設計方針:
 * - SSRのHTMLはそのまま表示しておき、JSが動いた時点で「画面外の要素だけ」隠す。
 *   CSSで最初から隠すとJS実行前や無効時に内容が見えなくなるため。
 * - マウント時に画面内にある要素は隠さない（ファーストビューのちらつき・LCP悪化を防ぐ）。
 * - prefers-reduced-motion が有効なら何もしない。
 * - IntersectionObserverは全要素で1つを共有する。
 */

export interface RevealOptions {
	/** 表示開始までの遅延（ms）。グリッドで順番に表示させたいときに使う */
	delay?: number;
}

const HIDDEN_CLASS = 'reveal';
const VISIBLE_CLASS = 'reveal--visible';

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
	if (!observer) {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					entry.target.classList.add(VISIBLE_CLASS);
					// 一度表示したら再び隠さない
					observer?.unobserve(entry.target);
				}
			},
			// 画面下端より10%内側に入った時点で表示する（端でいきなり出るのを避ける）。
			// thresholdを割合にすると、画面の数倍の高さがあるセクション（スマホで縦積みの
			// カード群など）は交差率が閾値に届かず永遠に表示されないため、0にしている
			{ rootMargin: '0px 0px -10% 0px', threshold: 0 }
		);
	}
	return observer;
}

function prefersReducedMotion(): boolean {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isInViewport(node: Element): boolean {
	const rect = node.getBoundingClientRect();
	return rect.top < window.innerHeight && rect.bottom > 0;
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	if (
		typeof IntersectionObserver === 'undefined' ||
		prefersReducedMotion() ||
		isInViewport(node)
	) {
		return {};
	}

	if (options.delay) {
		node.style.setProperty('--reveal-delay', `${options.delay}ms`);
	}
	node.classList.add(HIDDEN_CLASS);
	getObserver().observe(node);

	return {
		destroy() {
			observer?.unobserve(node);
		}
	};
}
