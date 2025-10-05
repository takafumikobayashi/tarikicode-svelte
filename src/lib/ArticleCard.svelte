<script lang="ts">
	import { lightThemeStore } from '$lib/themeStore';

	export let title: string;
	export let description: string;
	export let url: string;
	export let image: string;
	export let site: string;

	let isLightTheme = true;
	$: isLightTheme = $lightThemeStore;
</script>

<a
	href={url}
	target="_blank"
	rel="noopener noreferrer"
	class="article-card"
	class:dark={!isLightTheme}
>
	<div class="card-content">
		{#if image}
			<div class="card-image">
				<img src={image} alt={title} />
			</div>
		{/if}
		<div class="card-info">
			<h3 class="card-title">{title}</h3>
			<p class="card-description">{description}</p>
			<span class="card-site">{site}</span>
		</div>
	</div>
</a>

<style>
	.article-card {
		display: block;
		border: 1px solid #e1e8ed;
		border-radius: 16px;
		overflow: hidden;
		transition: all 0.2s ease;
		text-decoration: none;
		color: inherit;
		background: white;
		margin-bottom: 1em;
	}

	.article-card:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border-color: #ccd6dd;
	}

	/* ダークモード */
	.article-card.dark {
		background: #16181c;
		border-color: #2f3336;
	}

	.article-card.dark:hover {
		box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
		border-color: #4a4e54;
	}

	.card-content {
		display: flex;
		flex-direction: column;
	}

	.card-image {
		width: 100%;
		height: 200px;
		overflow: hidden;
		background: #f7f9fa;
	}

	.article-card.dark .card-image {
		background: #0d0f12;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-info {
		padding: 12px 16px;
	}

	.card-title {
		font-size: 15px;
		font-weight: 700;
		line-height: 20px;
		margin: 0 0 4px 0;
		color: #0f1419;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.article-card.dark .card-title {
		color: #e7e9ea;
	}

	.card-description {
		font-size: 14px;
		line-height: 18px;
		color: #536471;
		margin: 0 0 8px 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.article-card.dark .card-description {
		color: #71767b;
	}

	.card-site {
		font-size: 13px;
		color: #536471;
		text-transform: uppercase;
	}

	.article-card.dark .card-site {
		color: #71767b;
	}

	/* レスポンシブ対応 */
	@media (max-width: 768px) {
		.card-image {
			height: 160px;
		}

		.card-title {
			font-size: 14px;
		}

		.card-description {
			font-size: 13px;
		}
	}
</style>
