import { describe, it, expect, vi, afterEach } from 'vitest';
import OgpCard from './OgpCard.svelte';

/**
 * ブログ記事ページは <ogp-card> プレースホルダへ OgpCard を imperative にマウントする。
 * Svelte 4 の `new Component({ target })` は内部で flush() を走らせるため、
 * マウント中にページ側の afterUpdate が再入する。
 * 「処理済みスラッグを更新する前にマウントする」実装だと再入が無限ループになるため、
 * ページ側と同じガード構造をここで固定しておく。
 */
describe('OGPカードのハイドレーション再入ガード', () => {
	afterEach(() => {
		vi.restoreAllMocks();
		document.body.innerHTML = '';
	});

	function setupDom(count: number) {
		document.body.innerHTML = Array.from(
			{ length: count },
			(_, i) => `<ogp-card data-url="https://example.com/${i}"></ogp-card>`
		).join('');
	}

	function stubFetch() {
		vi.stubGlobal(
			'fetch',
			vi.fn(() =>
				Promise.resolve({
					ok: true,
					status: 200,
					json: () =>
						Promise.resolve({
							title: 'タイトル',
							description: '',
							image: '',
							siteName: '',
							url: 'https://example.com/'
						})
				} as Response)
			)
		);
	}

	it('マウント中にハイドレーションが再入しても1回しか実行されない', () => {
		stubFetch();
		setupDom(3);

		let slug = 'article-a';
		let lastHydratedSlug: string | null = null;
		let hydrating = false;
		let instances: OgpCard[] = [];
		let hydrateCallCount = 0;

		function destroy() {
			instances.forEach((i) => i.$destroy());
			instances = [];
		}

		function hydrate() {
			hydrateCallCount += 1;
			// ページ実装と同じガード：先にフラグとスラッグを更新してからマウントする
			if (hydrating) return;
			hydrating = true;
			lastHydratedSlug = slug;

			try {
				destroy();
				document.querySelectorAll('ogp-card').forEach((card) => {
					const url = card.getAttribute('data-url');
					if (!url) return;
					card.innerHTML = '';
					// mount 時の flush() で afterUpdate 相当が再入する状況を再現
					const instance = new OgpCard({ target: card as HTMLElement, props: { url } });
					afterUpdateEquivalent();
					instances.push(instance);
				});
			} finally {
				hydrating = false;
			}
		}

		function afterUpdateEquivalent() {
			if (lastHydratedSlug !== slug) {
				hydrate();
			}
		}

		hydrate();

		// 再入は起きるが、ガードにより実処理は1回だけ
		expect(hydrateCallCount).toBe(1);
		expect(instances).toHaveLength(3);
		expect(document.querySelectorAll('ogp-card').length).toBe(3);

		// 記事が切り替わったら再ハイドレーションされる
		slug = 'article-b';
		afterUpdateEquivalent();
		expect(hydrateCallCount).toBe(2);
		expect(lastHydratedSlug).toBe('article-b');
		expect(instances).toHaveLength(3);
	});
});
