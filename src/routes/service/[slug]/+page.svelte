<script lang="ts">
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import { AppConfig } from '$lib/AppConfig';
	import { lightThemeStore } from '$lib/themeStore';
	import { page } from '$app/stores';

	export let data;

	let isLightTheme = true;
	$: isLightTheme = $lightThemeStore;
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

	.cta-button.dark {
		background: #bb86fc;
		color: #121212;
	}

	.cta-button.dark:hover {
		filter: brightness(1.15);
		box-shadow: 0 4px 12px rgba(187, 134, 252, 0.3);
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
</style>
