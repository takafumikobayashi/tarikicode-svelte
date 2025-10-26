<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import ArticleCard from './ArticleCard.svelte';
	import { onMount } from 'svelte';

	let articles: Array<{
		title: string;
		description: string;
		url: string;
		image: string;
		site: string;
	}> = [];

	let loading = true;

	onMount(async () => {
		try {
			// pickup-articles.jsonからURL一覧を取得
			const response = await fetch('/pickup-articles.json');
			const data = await response.json();

			// 各URLのOGP情報を取得
			const ogpPromises = data.articles.map(async (article: { url: string }) => {
				try {
					const ogpResponse = await fetch(
						`/api/ogp?url=${encodeURIComponent(article.url)}`
					);
					const ogpData = await ogpResponse.json();
					return {
						title: ogpData.title || 'No Title',
						description: ogpData.description || '',
						url: article.url,
						image: ogpData.image || '',
						site: ogpData.siteName || new URL(article.url).hostname
					};
				} catch (error) {
					console.error(`Failed to fetch OGP for ${article.url}:`, error);
					return {
						title: 'Failed to load',
						description: '',
						url: article.url,
						image: '',
						site: new URL(article.url).hostname
					};
				}
			});

			articles = await Promise.all(ogpPromises);
		} catch (error) {
			console.error('Failed to load articles:', error);
		} finally {
			loading = false;
		}
	});
</script>

<LayoutGrid>
	<!-- 外部記事カード -->
	{#if loading}
		<Cell span={4}>
			<div class="demo-cell">
				<p>記事を読み込み中...</p>
			</div>
		</Cell>
	{:else}
		{#each articles as article}
			<Cell span={6}>
				<div class="demo-cell">
					<ArticleCard
						title={article.title}
						description={article.description}
						url={article.url}
						image={article.image}
						site={article.site}
					/>
				</div>
			</Cell>
		{/each}
	{/if}

	<!-- 既存のSpeaker Deck埋め込み -->
	<Cell span={6}>
		<div class="demo-cell">
			<iframe
				class="speakerdeck-iframe"
				frameborder="0"
				src="https://speakerdeck.com/player/59662588fd324da6bceb344db49a6e50"
				title="2024.1.20気ままに勉強会#75"
				allowfullscreen={true}
				style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;"
				data-ratio="1.7777777777777777"
			></iframe>
		</div>
	</Cell>
	<Cell span={6}>
		<div class="demo-cell">
			<iframe
				class="speakerdeck-iframe"
				frameborder="0"
				src="https://speakerdeck.com/player/0722866deb084bbfbb0eaeec191a615d"
				title="2024.10.26_Power_Platform_Administrator勉強会#2"
				allowfullscreen={true}
				style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;"
				data-ratio="1.7777777777777777"
			></iframe>
		</div>
	</Cell>
	<Cell span={6}>
		<div class="demo-cell">
			<iframe
				class="note-embed"
				src="https://note.com/embed/notes/n16a999fe3b1e"
				title="Note article embed"
				style="border: 0; display: block; max-width: 99%; width: 494px; padding: 0px; margin: 10px 0px; position: static; visibility: visible;"
				height="400"
			></iframe><script
				async
				src="https://note.com/scripts/embed.js"
				charset="utf-8"
			></script>
		</div>
	</Cell>
</LayoutGrid>

<style>
	.demo-cell {
		width: 100%;
		margin-top: 1em;
		margin-bottom: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
