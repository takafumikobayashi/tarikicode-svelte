<script lang="ts">
	import { onMount, onDestroy, afterUpdate, tick } from 'svelte';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import { page } from '$app/stores';
	import { AppConfig } from '$lib/AppConfig';
	import PostFooter from '$lib/PostFooter.svelte';

	// ハイライトのスタイルを読み込む
	import hljs from 'highlight.js';
	import ChatGptGoMap from '$lib/ChatGptGoMap.svelte';
	import OgpCard from '$lib/OgpCard.svelte';
	import type { SvelteComponent } from 'svelte';
	import { lightThemeStore } from '$lib/themeStore';

	export let data;

	// Chart.jsモジュール（dynamic import for SSR compatibility）
	let chartModule: typeof import('$lib/ChartRenderer') | null = null;
	let lastRenderedChartSlug: string | null = null;
	let chartRenderingPromise: Promise<void> | null = null;

	// imperativeに作成したコンポーネントインスタンスを保存（メモリリーク防止）
	let mapComponentInstances: SvelteComponent[] = [];
	let lastOgpHydratedSlug: string | null = null;
	let lastHydratedSlug: string | null = null;
	let mapHydrationPromise: Promise<void> | null = null;

	// テーマストア（クライアント側でのみ購読）
	let isLightTheme = true;
	let unsubscribeTheme: (() => void) | null = null;

	let ogpCardInstances: SvelteComponent[] = [];
	// ハイドレーション中の再入を防ぐフラグ（詳細は hydrateOgpCards のコメント参照）
	let hydratingOgpCards = false;

	function destroyOgpCards() {
		if (!ogpCardInstances.length) {
			return;
		}

		ogpCardInstances.forEach((instance) => {
			instance.$destroy();
		});
		ogpCardInstances = [];
	}

	// 本文中の <ogp-card> プレースホルダに OgpCard をマウントする。
	// 記事本文は {@html} で描画されるためコンポーネントを宣言的に書けず、
	// 描画後にimperativeへ差し込む必要がある
	function hydrateOgpCards() {
		// new OgpCard() は内部で flush() を走らせ、その中で当ページの afterUpdate が再入する。
		// 処理済みスラッグの更新をマウント後にすると、再入時に未更新のまま再ハイドレーションが
		// 走って無限ループになるため、フラグとスラッグを先に更新しておく
		if (hydratingOgpCards) {
			return;
		}
		hydratingOgpCards = true;
		lastOgpHydratedSlug = post_string ?? null;

		try {
			destroyOgpCards();
			mountOgpCards();
		} finally {
			hydratingOgpCards = false;
		}
	}

	function mountOgpCards() {
		document.querySelectorAll('ogp-card').forEach((card) => {
			const url = card.getAttribute('data-url');
			if (!url) return;

			card.innerHTML = '';
			const instance = new OgpCard({
				target: card as HTMLElement,
				props: {
					url,
					fallbackImage: card.getAttribute('data-fallback-image') ?? '',
					fallbackTitle: card.getAttribute('data-fallback-title') ?? '',
					fallbackDesc: card.getAttribute('data-fallback-desc') ?? '',
					fallbackSite: card.getAttribute('data-fallback-site') ?? ''
				}
			});
			ogpCardInstances.push(instance);
		});
	}

	function destroyChatGptGoMaps() {
		if (!mapComponentInstances.length) {
			return;
		}

		mapComponentInstances.forEach((instance) => {
			instance.$destroy();
		});
		mapComponentInstances = [];
	}

	async function reinitializeChatGptGoMaps() {
		destroyChatGptGoMaps();
		await tick();

		const mapElements = document.querySelectorAll('chatgpt-go-map');
		mapElements.forEach((mapEl) => {
			const mapInstance = new ChatGptGoMap({
				target: mapEl as HTMLElement
			});
			mapComponentInstances.push(mapInstance);
		});

		lastHydratedSlug = post_string ?? null;
	}

	function scheduleMapHydration() {
		if (mapHydrationPromise) {
			return;
		}

		mapHydrationPromise = reinitializeChatGptGoMaps().finally(() => {
			mapHydrationPromise = null;
		});
	}

	async function renderChartsForCurrentPost() {
		// Chart.jsモジュールをロード（初回のみ）
		if (!chartModule) {
			chartModule = await import('$lib/ChartRenderer');
		}

		// 古いチャートインスタンスをクリーンアップ
		chartModule.cleanupCharts();
		await tick();

		// 新しいチャートを描画
		chartModule.renderCharts(!isLightTheme);

		// 描画完了を記録
		lastRenderedChartSlug = post_string ?? null;
	}

	function scheduleChartRendering() {
		if (chartRenderingPromise) {
			return;
		}

		chartRenderingPromise = renderChartsForCurrentPost().finally(() => {
			chartRenderingPromise = null;
		});
	}

	onMount(async () => {
		// テーマストアを購読（クライアント側でのみ）
		unsubscribeTheme = lightThemeStore.subscribe((value) => {
			isLightTheme = value;
		});

		// Mermaid図の描画はHeader内のThemeButtonが$lib/Mermaidを通して行う。
		// ここで初期化すると、描画途中でMermaidのグローバル設定が上書きされ、
		// 親要素の実測幅を必要とするガント図が既定の300pxで描かれてしまう。

		// Chart.jsグラフの描画（dynamic import for SSR compatibility）
		scheduleChartRendering();

		// コンテンツがDOMにレンダリングされた後にハイライトを適用
		document
			.querySelectorAll('pre code:not(.language-mermaid):not(.language-chartjs)')
			.forEach((block) => {
				// @ts-expect-error highlight.js v11 exposes highlightBlock at runtime
				hljs.highlightBlock(block);
			});

		// OGPカードの処理
		hydrateOgpCards();

		// ChatGPT Go地図の処理
		scheduleMapHydration();
	});

	// slugを取得
	let post_string: string = '';
	// page ストアを購読して slug パラメータを取得
	const unsubscribe = page.subscribe(($page) => {
		post_string = $page.params.slug || '';
	});

	afterUpdate(() => {
		if (!post_string) {
			return;
		}

		// Chart.jsの再描画（記事変更時）
		if (lastRenderedChartSlug !== post_string) {
			scheduleChartRendering();
		}

		// 地図の再ハイドレーション（記事変更時）
		if (lastHydratedSlug !== post_string) {
			scheduleMapHydration();
		}

		// OGPカードの再ハイドレーション（記事変更時）
		if (lastOgpHydratedSlug !== post_string) {
			hydrateOgpCards();
		}
	});

	// テーマ変更時にチャートを再描画
	$: if (chartModule && typeof isLightTheme !== 'undefined') {
		// DOMがマウント済みの場合のみ実行
		if (typeof document !== 'undefined') {
			chartModule.updateChartsTheme(!isLightTheme);
		}
	}

	// コンポーネントが破棄されたときにクリーンアップ
	onDestroy(() => {
		// page ストアの購読を解除
		unsubscribe();

		// テーマストアの購読を解除
		unsubscribeTheme?.();

		// Chart.jsインスタンスをクリーンアップ
		chartModule?.cleanupCharts();

		// imperativeに作成した地図コンポーネントを破棄（メモリリーク防止）
		destroyChatGptGoMaps();

		// 同上：OGPカードコンポーネントを破棄
		destroyOgpCards();
	});

	$: jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: data.metadata?.title || post_string,
		image: [
			data.metadata?.image ||
				`${AppConfig.url}${AppConfig.post_string[post_string] || '/default-og-image.png'}`
		],
		datePublished: data.metadata?.date ? new Date(data.metadata.date).toISOString() : undefined,
		dateModified: data.metadata?.date ? new Date(data.metadata.date).toISOString() : undefined,
		author: [
			{
				'@type': 'Person',
				name: AppConfig.author,
				url: AppConfig.contacts.twitter
			}
		],
		description: data.metadata?.description || AppConfig.description,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': `${AppConfig.url}/blog/${post_string}`
		}
	};

	$: jsonLdString = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<!-- Open Graph メタタグ -->
	<meta
		property="og:title"
		content={data.metadata?.title || `${post_string} - ${AppConfig.title}`}
	/>
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`${AppConfig.url}/blog/${post_string}`} />
	<meta
		property="og:image"
		content={data.metadata?.image ||
			`${AppConfig.url}${AppConfig.post_string[post_string] || '/default-og-image.png'}`}
	/>
	<meta property="og:description" content={data.metadata?.description || AppConfig.description} />
	<meta property="og:site_name" content={AppConfig.title} />
	{#if data.metadata?.date}
		<meta property="article:published_time" content={data.metadata.date} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={AppConfig.xaccuont} />
	<meta name="twitter:title" content={data.metadata?.title || AppConfig.title} />
	<meta
		name="twitter:description"
		content={data.metadata?.description || AppConfig.description}
	/>
	<meta
		name="twitter:image"
		content={data.metadata?.image ||
			`${AppConfig.url}${AppConfig.post_string[post_string] || '/default-og-image.png'}`}
	/>

	{@html `<script type="application/ld+json">${jsonLdString}<\/script>`}

	<link
		href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
		rel="stylesheet"
	/>
</svelte:head>

<div class="mdc-typography--body1">
	<div class="content fade-in">
		<Header />
		{#if data.metadata?.image}
			<div class="hero-image-container">
				<div class="hero-image" style="background-image: url({data.metadata.image});" />
			</div>
		{/if}
		<article>
			<div class="article-header">
				{#if data.metadata?.type === 'blog'}
					<a href="/blog" class="back-link">
						<span class="back-arrow">←</span> ブログ一覧に戻る
					</a>
				{/if}
				{#if data.metadata?.date || data.metadata?.category}
					<div class="article-meta">
						{#if data.metadata?.date}
							<span class="article-date">{data.metadata.date}</span>
						{/if}
						{#if data.metadata?.category}
							<span class="article-category">{data.metadata.category}</span>
						{/if}
					</div>
				{/if}
			</div>
			{@html data.body}
		</article>
		<PostFooter url="/blog/{post_string}" title={data.metadata?.title || post_string} />
		<Footer />
	</div>
</div>

<style>
	.hero-image-container {
		margin-top: 60px;
		width: 100%;
		margin-bottom: 0;
	}

	.hero-image {
		width: 100%;
		height: 25vh;
		background-size: cover;
		background-position: center;
		border-radius: 20px;
	}

	.article-header {
		margin-top: 1.5em;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		color: var(--mdc-theme-primary, #6200ee);
		text-decoration: none;
		font-size: 0.9rem;
		margin-bottom: 1em;
		transition: opacity 0.2s;
	}

	.back-link:hover {
		opacity: 0.7;
	}

	.back-arrow {
		font-size: 1.2em;
		font-weight: bold;
	}

	.article-meta {
		display: flex;
		gap: 1em;
		margin-top: 1em;
		margin-bottom: 1.5em;
		padding-bottom: 1em;
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
		align-items: center;
	}

	.article-date {
		font-size: 0.9rem;
	}

	.article-category {
		font-size: 0.9rem;
		background-color: var(--mdc-theme-primary, #6200ee);
		color: white;
		padding: 0.2em 0.6em;
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.content {
			padding-top: 70px;
		}

		.hero-image-container {
			margin-top: 10px;
		}
	}

	/* モバイル対応 */
	@media (max-width: 768px) {
	}
	/* ===== quadrantChart（情報の四象限）の見た目調整 =====
	   他の種類の図に影響させないよう aria-roledescription で対象を限定する。 */

	/* 既定は max-width:500px 固定で本文カラムより小さく、左寄せになる。
	   これはSVGのインラインstyle属性なので、上書きには!importantが要る。 */
	article :global(svg[aria-roledescription='quadrantChart']) {
		max-width: 680px !important;
		display: block;
		margin: 0 auto;
	}

	/* データ点の●は、どの象限にも項目が1つずつしかなくラベルと役割が重複するため隠す。
	   Mermaidにはconfig quadrantChart.pointRadius があるが、内部が
	   `pointRadius || 5` というフォールバックのため0を指定しても消せない。
	   textは別要素で座標を持つので、circleを隠してもラベル位置は動かない。 */
	article :global(svg[aria-roledescription='quadrantChart'] .data-points circle) {
		display: none;
	}

	/* ライトテーマの4象限は既定が #ECECFF〜#fbfbff とほぼ同色で、区画の境目が読み取れない。
	   rectのfillはpresentation attributeでCSSより優先度が低いため!importantは不要。
	   子の並び順は quadrant-1(右上) → 2(左上) → 3(左下) → 4(右下)。

	   ダークテーマではMermaidがdarkテーマで再描画し、文字色が白系・塗りが暗色になる。
	   そこへ淡色を上書きすると文字が読めなくなるため、ダーク時は既定の暗色に任せる。
	   body[data-theme]はThemeButtonがマウント後に設定するため、未設定の初期状態でも
	   ライト配色が当たるよう :not([data-theme='dark']) で「ダーク以外」を対象にする。 */

	:global(body:not([data-theme='dark']))
		article
		:global(
			svg[aria-roledescription='quadrantChart'] .quadrants > .quadrant:nth-child(1) rect
		) {
		fill: #efe9f8; /* 右上: 書籍・資格・体系化された知識 */
	}

	:global(body:not([data-theme='dark']))
		article
		:global(
			svg[aria-roledescription='quadrantChart'] .quadrants > .quadrant:nth-child(2) rect
		) {
		fill: #e8f1fb; /* 左上: ネット記事・技術論文 */
	}

	:global(body:not([data-theme='dark']))
		article
		:global(
			svg[aria-roledescription='quadrantChart'] .quadrants > .quadrant:nth-child(3) rect
		) {
		fill: #e6f4ec; /* 左下: 口コミ・営業経由・コミュニティ */
	}

	:global(body:not([data-theme='dark']))
		article
		:global(
			svg[aria-roledescription='quadrantChart'] .quadrants > .quadrant:nth-child(4) rect
		) {
		fill: #fbeef0; /* 右下: 経験談・価値観・暗黙知 */
	}
</style>
