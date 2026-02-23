<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';
	import mermaid from 'mermaid';
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import { AppConfig } from '$lib/AppConfig';
	import { lightThemeStore } from '$lib/themeStore';
	import { page } from '$app/stores';

	export let data;

	let isLightTheme = true;
	$: isLightTheme = $lightThemeStore;

	function escapeHtml(str: string): string {
		return str
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#x27;');
	}

	let lastProcessedSlug = '';

	async function processMermaid() {
		const mermaidElements = document.querySelectorAll('.language-mermaid');
		for (const element of mermaidElements) {
			const code = element.textContent || '';
			const parent = element.parentElement;
			if (parent) {
				try {
					const { svg } = await mermaid.render(`mermaid-${Math.random()}`, code);
					parent.innerHTML = svg;
				} catch (e) {
					console.error('Mermaid rendering error:', e);
				}
			}
		}
	}

	function processOgpCards() {
		const ogpCards = document.querySelectorAll('ogp-card');
		ogpCards.forEach(async (card) => {
			const url = card.getAttribute('data-url');
			if (!url) return;

			card.innerHTML = '<div class="ogp-loading">読み込み中...</div>';

			try {
				const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`);
				if (!response.ok) throw new Error('Failed to fetch OGP data');

				const ogpData = await response.json();

				const safeTitle = escapeHtml(ogpData.title || '');
				const safeDesc = ogpData.description ? escapeHtml(ogpData.description) : '';
				const safeSite = ogpData.siteName ? escapeHtml(ogpData.siteName) : '';
				const safeImage =
					ogpData.image && /^https?:\/\//.test(ogpData.image)
						? escapeHtml(ogpData.image)
						: '';

				card.innerHTML = `
					<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="ogp-link-card">
						<div class="ogp-card-wrapper">
							${safeImage ? `<div class="ogp-card-image"><img src="${safeImage}" alt="${safeTitle}" /></div>` : ''}
							<div class="ogp-card-text">
								<h3 class="ogp-card-title">${safeTitle || escapeHtml(url)}</h3>
								${safeDesc ? `<p class="ogp-card-description">${safeDesc}</p>` : ''}
								${safeSite ? `<p class="ogp-card-site">${safeSite}</p>` : ''}
							</div>
						</div>
					</a>
				`;
			} catch {
				const safeUrl = escapeHtml(url);
				card.innerHTML = `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="ogp-error-link">${safeUrl}</a>`;
			}
		});
	}

	onMount(async () => {
		mermaid.initialize({ startOnLoad: false, theme: 'default' });
		lastProcessedSlug = $page.params.slug ?? '';
		await processMermaid();
		processOgpCards();
	});

	afterUpdate(async () => {
		const currentSlug = $page.params.slug;
		if (currentSlug && currentSlug !== lastProcessedSlug) {
			lastProcessedSlug = currentSlug;
			await processMermaid();
			processOgpCards();
		}
	});
</script>

<svelte:head>
	<title>{data.metadata?.title || 'Service'} - {AppConfig.title}</title>
	<meta name="description" content={data.metadata?.description || AppConfig.description} />

	<meta property="og:title" content={data.metadata?.title || AppConfig.title} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${AppConfig.url}/service/${$page.params.slug}`} />
	<meta property="og:image" content={data.metadata?.image || AppConfig.post_string.about} />
	<meta property="og:description" content={data.metadata?.description || AppConfig.description} />
	<meta property="og:site_name" content={AppConfig.title} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={AppConfig.xaccuont} />
	<meta name="twitter:title" content={data.metadata?.title || AppConfig.title} />
	<meta
		name="twitter:description"
		content={data.metadata?.description || AppConfig.description}
	/>
	<meta name="twitter:image" content={data.metadata?.image || AppConfig.post_string.about} />
</svelte:head>

<div class="mdc-typography--body1">
	<div class="content fade-in">
		<Header />
		<article class="service-detail">
			<div class="article-header">
				<a href="/" class="back-link">
					<span class="back-arrow">&larr;</span> トップに戻る
				</a>
			</div>
			{#if data.metadata?.label}
				<span class="service-label" class:dark={!isLightTheme}>{data.metadata.label}</span>
			{/if}
			<div class="service-body">
				{@html data.body}
			</div>
			{#if data.metadata?.service_url}
				<div class="cta-container">
					<a
						href={data.metadata.service_url}
						target="_blank"
						rel="noopener noreferrer"
						class="cta-button"
						class:dark={!isLightTheme}
					>
						サービスを利用する &rarr;
					</a>
				</div>
			{/if}
		</article>
		<Footer />
	</div>
</div>

<style>
	.service-detail {
		max-width: 800px;
		margin: 0 auto;
		padding: 0 1em;
	}

	.article-header {
		margin-top: 5em;
		margin-bottom: 1em;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5em;
		color: var(--mdc-theme-primary, #6200ee);
		text-decoration: none;
		font-size: 0.9rem;
		transition: opacity 0.2s;
	}

	.back-link:hover {
		opacity: 0.7;
	}

	.back-arrow {
		font-size: 1.2em;
		font-weight: bold;
	}

	.service-label {
		display: inline-block;
		padding: 4px 16px;
		font-size: 13px;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: white;
		background: var(--mdc-theme-secondary, #676778);
		border-radius: 4px;
		margin-bottom: 1em;
	}

	.service-label.dark {
		background: #9e9eae;
		color: #121212;
	}

	.service-body {
		line-height: 1.8;
	}

	:global(body[data-theme='light']) .service-body :global(.logo-dark) {
		display: none;
	}

	:global(body[data-theme='dark']) .service-body :global(.logo-light) {
		display: none;
	}

	.service-body :global(.img-center) {
		display: block;
		margin: 0 auto;
		max-width: 100%;
		height: auto;
	}

	.cta-container {
		text-align: center;
		margin: 3em 0;
	}

	.cta-button {
		display: inline-block;
		padding: 16px 48px;
		background: var(--mdc-theme-primary, #4b53bc);
		color: white;
		font-size: 1.1rem;
		font-weight: 700;
		text-decoration: none;
		border-radius: 8px;
		transition: all 0.2s ease;
	}

	.cta-button:hover {
		filter: brightness(0.85);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(75, 83, 188, 0.3);
	}

	@media (max-width: 768px) {
		.article-header {
			margin-top: 5em;
		}

		.cta-button {
			padding: 14px 32px;
			font-size: 1rem;
		}
	}

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
