<script lang="ts">
	import { onMount, onDestroy, afterUpdate, tick } from 'svelte';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import { page } from '$app/stores';
	import { AppConfig } from '$lib/AppConfig';
	import PostFooter from '$lib/PostFooter.svelte';

	// ハイライトのスタイルを読み込む
	import hljs from 'highlight.js';
	import mermaid from 'mermaid';
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

		// Mermaidの初期化
		mermaid.initialize({
			startOnLoad: false,
			theme: 'default'
		});

		// Mermaid図の描画
		const mermaidElements = document.querySelectorAll('.language-mermaid');
		for (const element of mermaidElements) {
			const code = element.textContent || '';
			const parent = element.parentElement;
			if (parent) {
				try {
					const { svg } = await mermaid.render(`mermaid-${Math.random()}`, code);
					parent.innerHTML = svg;
				} catch (error) {
					console.error('Mermaid rendering error:', error);
					parent.innerHTML = `<pre>Mermaid rendering error: ${error}</pre>`;
				}
			}
		}

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
</style>
