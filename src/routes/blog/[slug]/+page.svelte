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
	import type { SvelteComponent } from 'svelte';

	export let data;

	// imperativeに作成したコンポーネントインスタンスを保存（メモリリーク防止）
	let mapComponentInstances: SvelteComponent[] = [];
	let lastHydratedSlug: string | null = null;
	let mapHydrationPromise: Promise<void> | null = null;

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

	onMount(async () => {
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

		// コンテンツがDOMにレンダリングされた後にハイライトを適用
		document.querySelectorAll('pre code:not(.language-mermaid)').forEach((block) => {
			// @ts-expect-error highlight.js v11 exposes highlightBlock at runtime
			hljs.highlightBlock(block);
		});

		// OGPカードの処理
		const ogpCards = document.querySelectorAll('ogp-card');
		ogpCards.forEach(async (card) => {
			const url = card.getAttribute('data-url');
			if (!url) return;

			// 読み込み中表示
			card.innerHTML = '<div class="ogp-loading">読み込み中...</div>';

			try {
				const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`);
				if (!response.ok) throw new Error('Failed to fetch OGP data');

				const ogpData = await response.json();

				// OGPカードのHTMLを生成
				card.innerHTML = `
					<a href="${url}" target="_blank" rel="noopener noreferrer" class="ogp-link-card">
						<div class="ogp-card-wrapper">
							${ogpData.image ? `<div class="ogp-card-image"><img src="${ogpData.image}" alt="${ogpData.title || ''}" /></div>` : ''}
							<div class="ogp-card-text">
								<h3 class="ogp-card-title">${ogpData.title || url}</h3>
								${ogpData.description ? `<p class="ogp-card-description">${ogpData.description}</p>` : ''}
								${ogpData.siteName ? `<p class="ogp-card-site">${ogpData.siteName}</p>` : ''}
							</div>
						</div>
					</a>
				`;
			} catch (error) {
				console.error('Error loading OGP card:', error);
				card.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="ogp-error-link">${url}</a>`;
			}
		});

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

		if (lastHydratedSlug === post_string) {
			return;
		}

		scheduleMapHydration();
	});

	// コンポーネントが破棄されたときにクリーンアップ
	onDestroy(() => {
		// page ストアの購読を解除
		unsubscribe();

		// imperativeに作成した地図コンポーネントを破棄（メモリリーク防止）
		destroyChatGptGoMaps();
	});
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

	/* OGPカードのスタイル */
	:global(.ogp-loading) {
		padding: 1em;
		text-align: center;
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
	}

	:global(.ogp-link-card) {
		display: block;
		text-decoration: none;
		color: inherit;
		margin: 1.5em 0;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.12));
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s;
	}

	:global(.ogp-link-card:hover) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		border-color: var(--mdc-theme-primary, #6200ee);
	}

	:global(.ogp-card-wrapper) {
		display: flex;
		gap: 1em;
		padding: 1em;
	}

	:global(.ogp-card-image) {
		flex-shrink: 0;
		width: 200px;
		height: 120px;
		overflow: hidden;
		border-radius: 8px;
		background-color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.06));
	}

	:global(.ogp-card-image img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	:global(.ogp-card-text) {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		min-width: 0;
	}

	:global(.ogp-card-title) {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.4;
		color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	:global(.ogp-card-description) {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	:global(.ogp-card-site) {
		margin: 0;
		font-size: 0.8rem;
		color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38));
	}

	:global(.ogp-error-link) {
		display: block;
		padding: 1em;
		margin: 1.5em 0;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.12));
		border-radius: 8px;
		color: var(--mdc-theme-primary, #6200ee);
		word-break: break-all;
	}

	/* モバイル対応 */
	@media (max-width: 768px) {
		:global(.ogp-card-wrapper) {
			flex-direction: column;
		}

		:global(.ogp-card-image) {
			width: 100%;
			height: 180px;
		}
	}
</style>
