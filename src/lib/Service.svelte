<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import ServiceCard from './ServiceCard.svelte';
	import { onMount } from 'svelte';

	let services: Array<{
		slug: string;
		name: string;
		subtitle: string;
		description: string;
		image: string;
		url: string;
		label?: string;
	}> = [];

	let loading = true;

	$: cardSpan = services.length === 1 ? 12 : 6;

	onMount(async () => {
		try {
			const response = await fetch('/services.json');
			const data = await response.json();
			services = data.services;
		} catch (error) {
			console.error('Failed to load services:', error);
		} finally {
			loading = false;
		}
	});
</script>

<LayoutGrid>
	{#if loading}
		<Cell span={4}>
			<div class="demo-cell">
				<p>サービスを読み込み中...</p>
			</div>
		</Cell>
	{:else}
		{#each services as service}
			<Cell span={cardSpan}>
				<div class="demo-cell">
					<ServiceCard
						name={service.name}
						subtitle={service.subtitle}
						description={service.description}
						slug={service.slug}
						image={service.image}
						label={service.label || ''}
					/>
				</div>
			</Cell>
		{/each}
	{/if}
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
