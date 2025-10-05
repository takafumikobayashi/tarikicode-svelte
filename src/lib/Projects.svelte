<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import GitHubRepoCard from './GitHubRepoCard.svelte';
	import { onMount } from 'svelte';

	let repos: Array<{
		name: string;
		full_name: string;
		description: string;
		html_url: string;
		language: string;
		stargazers_count: number;
		forks_count: number;
		updated_at: string;
	}> = [];

	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			const response = await fetch('/api/github/repos');
			if (!response.ok) {
				throw new Error('Failed to fetch repositories');
			}
			const data = await response.json();
			repos = data.repos;
		} catch (err) {
			console.error('Failed to load GitHub repositories:', err);
			error = true;
		} finally {
			loading = false;
		}
	});
</script>

<div class="projects-container">
	<div class="section-header">
		<h2 class="mdc-typography--headline5">GitHub Projects</h2>
		<p class="section-description mdc-typography--body1">
			Recent open source projects and code samples
		</p>
	</div>

	{#if loading}
		<div class="loading-state">
			<p>Loading repositories...</p>
		</div>
	{:else if error}
		<div class="error-state">
			<p>Failed to load repositories. Please try again later.</p>
		</div>
	{:else}
		<LayoutGrid>
			{#each repos as repo}
				<Cell span={6} spanTablet={6} spanPhone={4}>
					<div class="card-wrapper">
						<GitHubRepoCard
							name={repo.name}
							description={repo.description}
							html_url={repo.html_url}
							language={repo.language}
							stargazers_count={repo.stargazers_count}
							forks_count={repo.forks_count}
							updated_at={repo.updated_at}
						/>
					</div>
				</Cell>
			{/each}
		</LayoutGrid>

		<div class="view-all">
			<a
				href="https://github.com/takafumikobayashi?tab=repositories"
				target="_blank"
				rel="noopener noreferrer"
				class="view-all-link"
			>
				View all repositories on GitHub →
			</a>
		</div>
	{/if}
</div>

<style>
	.projects-container {
		padding: 0;
	}

	.projects-container :global(.mdc-layout-grid) {
		padding: 0;
	}

	.projects-container :global(.mdc-layout-grid__inner) {
		grid-gap: 24px;
	}

	.section-header {
		margin-bottom: 24px;
	}

	.section-header h2 {
		margin: 0 0 8px 0;
		font-size: 24px;
		font-weight: 600;
	}

	.section-description {
		margin: 0;
		color: #656d76;
		font-size: 14px;
	}

	.loading-state,
	.error-state {
		text-align: center;
		padding: 40px 20px;
		color: #656d76;
	}

	.view-all {
		text-align: center;
		margin-top: 24px;
		padding: 20px;
	}

	.view-all-link {
		display: inline-block;
		padding: 10px 24px;
		background: #4b53bc;
		color: #ffffff;
		text-decoration: none;
		border-radius: 6px;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	.view-all-link:hover {
		background: #3a4299;
	}

	@media (max-width: 768px) {
		.section-header h2 {
			font-size: 20px;
		}

		.section-description {
			font-size: 13px;
		}
	}
</style>
