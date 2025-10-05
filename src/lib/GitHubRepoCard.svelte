<script lang="ts">
	import { lightThemeStore } from '$lib/themeStore';

	export let name: string;
	export let description: string;
	export let html_url: string;
	export let language: string;
	export let stargazers_count: number;
	export let forks_count: number;
	export let updated_at: string;

	let isLightTheme = true;
	$: isLightTheme = $lightThemeStore;

	// 最終更新日をフォーマット
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 30) return `${diffDays} days ago`;
		if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
		return `${Math.floor(diffDays / 365)} years ago`;
	}

	// 言語ごとの色
	const languageColors: { [key: string]: string } = {
		TypeScript: '#3178c6',
		JavaScript: '#f1e05a',
		Python: '#3572A5',
		Go: '#00ADD8',
		Rust: '#dea584',
		Java: '#b07219',
		Ruby: '#701516',
		PHP: '#4F5D95',
		Swift: '#F05138',
		Kotlin: '#A97BFF',
		CSS: '#563d7c',
		HTML: '#e34c26',
		Shell: '#89e051',
		Vue: '#41b883',
		Svelte: '#ff3e00'
	};
</script>

<a
	href={html_url}
	target="_blank"
	rel="noopener noreferrer"
	class="repo-card"
	class:dark={!isLightTheme}
>
	<div class="card-header">
		<svg
			aria-hidden="true"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			class="repo-icon"
			fill="currentColor"
		>
			<path
				d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"
			></path>
		</svg>
		<h3 class="repo-name mdc-typography--headline5">{name}</h3>
	</div>

	<div class="repo-description mdc-typography--body1">
		{description || 'No description provided'}
	</div>

	<div class="repo-meta">
		{#if language}
			<span class="language">
				<span
					class="language-color"
					style="background-color: {languageColors[language] || '#666'}"
				></span>
				{language}
			</span>
		{/if}

		{#if stargazers_count > 0}
			<span class="stars">
				<svg
					aria-hidden="true"
					height="16"
					viewBox="0 0 16 16"
					width="16"
					fill="currentColor"
					class="meta-icon"
				>
					<path
						d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"
					></path>
				</svg>
				{stargazers_count}
			</span>
		{/if}

		{#if forks_count > 0}
			<span class="forks">
				<svg
					aria-hidden="true"
					height="16"
					viewBox="0 0 16 16"
					width="16"
					fill="currentColor"
					class="meta-icon"
				>
					<path
						d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"
					></path>
				</svg>
				{forks_count}
			</span>
		{/if}

		<span class="updated">
			Updated {formatDate(updated_at)}
		</span>
	</div>
</a>

<style>
	.repo-card {
		display: flex;
		flex-direction: column;
		border: 1px solid #d0d7de;
		border-radius: 6px;
		padding: 16px;
		text-decoration: none;
		color: inherit;
		background: #ffffff;
		transition: all 0.2s ease;
		height: 100%;
		min-height: 180px;
	}

	.repo-card:hover {
		box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
		border-color: #4b53bc;
	}

	.repo-card.dark {
		background: #0d1117;
		border-color: #30363d;
		color: #c9d1d9;
	}

	.repo-card.dark:hover {
		border-color: #4b53bc;
		box-shadow: 0 3px 8px rgba(75, 83, 188, 0.1);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}

	.repo-icon {
		color: #656d76;
		flex-shrink: 0;
	}

	.repo-card.dark .repo-icon {
		color: #8b949e;
	}

	.repo-name {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: #0969da;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.repo-card.dark .repo-name {
		color: #58a6ff;
	}

	.repo-description {
		margin: 0 0 12px 0;
		font-size: 14px;
		color: #656d76;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		min-height: 63px;
	}

	.repo-card.dark .repo-description {
		color: #8b949e;
	}

	.repo-meta {
		display: flex;
		align-items: center;
		gap: 16px;
		font-size: 12px;
		color: #656d76;
		flex-wrap: wrap;
		margin-top: auto;
	}

	.repo-card.dark .repo-meta {
		color: #8b949e;
	}

	.language {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.language-color {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		display: inline-block;
	}

	.stars,
	.forks {
		display: flex;
		align-items: center;
		gap: 4px;
	}

	.meta-icon {
		width: 16px;
		height: 16px;
	}

	.updated {
		margin-left: auto;
	}

	@media (max-width: 768px) {
		.repo-card {
			padding: 12px;
			min-height: 130px;
		}

		.repo-name {
			font-size: 13px;
		}

		.repo-description {
			font-size: 11px;
		}

		.repo-meta {
			font-size: 11px;
			gap: 12px;
		}
	}
</style>
