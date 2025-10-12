<script lang="ts">
	import { onMount } from 'svelte';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { AppConfig } from '$lib/AppConfig';
	import PostFooter from '$lib/PostFooter.svelte';

	// ハイライトのスタイルを読み込む
	import hljs from 'highlight.js';
	import mermaid from 'mermaid';

	export let data;

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
			//@ts-ignore
			hljs.highlightBlock(block);
		});
	});

	// slugを取得
	let post_string: string;
	// page ストアを購読して slug パラメータを取得
	const unsubscribe = page.subscribe(($page) => {
		post_string = $page.params.slug;
	});

	// コンポーネントが破棄されたときに購読を解除
	onDestroy(unsubscribe);
</script>

<svelte:head>
	<!-- Open Graph メタタグ -->
	<meta property="og:title" content={data.metadata?.title || `${post_string} - ${AppConfig.title}`} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`${AppConfig.url}/blog/${post_string}`} />
	<meta property="og:image" content={data.metadata?.image || `${AppConfig.url}${AppConfig.post_string[post_string] || '/default-og-image.png'}`} />
	<meta property="og:description" content={data.metadata?.description || AppConfig.description} />
	<meta property="og:site_name" content={AppConfig.title} />
	{#if data.metadata?.date}
		<meta property="article:published_time" content={data.metadata.date} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={AppConfig.xaccuont} />
	<meta name="twitter:title" content={data.metadata?.title || AppConfig.title} />
	<meta name="twitter:description" content={data.metadata?.description || AppConfig.description} />
	<meta name="twitter:image" content={data.metadata?.image || `${AppConfig.url}${AppConfig.post_string[post_string] || '/default-og-image.png'}`} />

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
		<PostFooter />
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
		.hero-image-container {
			margin-top: 40px;
		}
	}
</style>
