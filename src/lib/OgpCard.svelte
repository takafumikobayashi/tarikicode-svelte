<script lang="ts">
	import { onMount } from 'svelte';
	import Card, { Content } from '@smui/card';

	export let url: string;

	interface OgpData {
		title: string;
		description: string;
		image: string;
		siteName: string;
		url: string;
	}

	let ogpData: OgpData | null = null;
	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`);
			if (!response.ok) {
				throw new Error('Failed to fetch OGP data');
			}
			ogpData = await response.json();
		} catch (err) {
			console.error('Error fetching OGP data:', err);
			error = true;
		} finally {
			loading = false;
		}
	});
</script>

{#if loading}
	<div class="ogp-card loading">
		<p>読み込み中...</p>
	</div>
{:else if error || !ogpData}
	<div class="ogp-card error">
		<a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
	</div>
{:else}
	<a href={url} target="_blank" rel="noopener noreferrer" class="ogp-link">
		<Card class="ogp-card-container">
			<div class="ogp-card-content">
				{#if ogpData.image}
					<div class="ogp-image">
						<img src={ogpData.image} alt={ogpData.title} />
					</div>
				{/if}
				<Content class="ogp-text">
					<h3 class="ogp-title">{ogpData.title}</h3>
					{#if ogpData.description}
						<p class="ogp-description">{ogpData.description}</p>
					{/if}
					{#if ogpData.siteName}
						<p class="ogp-site-name">{ogpData.siteName}</p>
					{/if}
				</Content>
			</div>
		</Card>
	</a>
{/if}

<style>
	.ogp-link {
		text-decoration: none;
		color: inherit;
		display: block;
		margin: 1.5em 0;
	}

	:global(.ogp-card-container) {
		transition: transform 0.2s, box-shadow 0.2s;
		cursor: pointer;
	}

	:global(.ogp-card-container:hover) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.ogp-card-content {
		display: flex;
		gap: 1em;
		padding: 1em;
	}

	.ogp-image {
		flex-shrink: 0;
		width: 200px;
		height: 120px;
		overflow: hidden;
		border-radius: 8px;
	}

	.ogp-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	:global(.ogp-text) {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		padding: 0 !important;
	}

	.ogp-title {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.4;
		color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));
	}

	.ogp-description {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.ogp-site-name {
		margin: 0;
		font-size: 0.8rem;
		color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38));
	}

	.ogp-card.loading,
	.ogp-card.error {
		padding: 1em;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.12));
		border-radius: 8px;
		margin: 1.5em 0;
	}

	.ogp-card.error a {
		color: var(--mdc-theme-primary, #6200ee);
		word-break: break-all;
	}

	/* モバイル対応 */
	@media (max-width: 768px) {
		.ogp-card-content {
			flex-direction: column;
		}

		.ogp-image {
			width: 100%;
			height: 180px;
		}
	}
</style>
