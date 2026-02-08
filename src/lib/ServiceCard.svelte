<script lang="ts">
	import { lightThemeStore } from '$lib/themeStore';

	export let name: string;
	export let subtitle: string;
	export let description: string;
	export let slug: string;
	export let image: string;
	export let label: string = '';

	let isLightTheme = true;
	$: isLightTheme = $lightThemeStore;
</script>

<a href="/service/{slug}" class="service-card" class:dark={!isLightTheme}>
	<div class="card-content">
		<div class="card-image">
			{#if label}
				<span class="card-label">{label}</span>
			{/if}
			{#if image}
				<img src={image} alt={name} />
			{:else}
				<div class="card-placeholder" class:dark={!isLightTheme}>
					<span class="placeholder-icon">&lt;/&gt;</span>
					<span class="placeholder-text">{name}</span>
				</div>
			{/if}
		</div>
		<div class="card-info">
			<h3 class="card-name">{name}</h3>
			<p class="card-subtitle">{subtitle}</p>
			<p class="card-description">{description}</p>
		</div>
	</div>
</a>

<style>
	.service-card {
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

	.service-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		border-color: #ccd6dd;
		transform: translateY(-2px);
	}

	.service-card.dark {
		background: #16181c;
		border-color: #2f3336;
	}

	.service-card.dark:hover {
		box-shadow: 0 4px 12px rgba(255, 255, 255, 0.06);
		border-color: #4a4e54;
	}

	.card-content {
		display: flex;
		flex-direction: column;
	}

	.card-image {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: hidden;
		background: #f7f9fa;
	}

	.service-card.dark .card-image {
		background: #0d0f12;
	}

	.card-label {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 1;
		padding: 4px 12px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.05em;
		color: white;
		background: var(--mdc-theme-secondary, #676778);
		border-radius: 4px;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.card-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 0.5em;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.card-placeholder.dark {
		background: linear-gradient(135deg, #3a4a8a 0%, #4a2d6a 100%);
	}

	.placeholder-icon {
		font-size: 2.5rem;
	}

	.placeholder-text {
		font-size: 1.2rem;
		font-weight: 700;
		letter-spacing: 0.05em;
	}

	.card-info {
		padding: 14px 16px;
	}

	.card-name {
		font-size: 17px;
		font-weight: 700;
		line-height: 22px;
		margin: 0 0 4px 0;
		color: #0f1419;
	}

	.service-card.dark .card-name {
		color: #e7e9ea;
	}

	.card-subtitle {
		font-size: 14px;
		font-weight: 600;
		line-height: 18px;
		color: var(--mdc-theme-primary, #4b53bc);
		margin: 0 0 8px 0;
	}

	.service-card.dark .card-subtitle {
		color: #bb86fc;
	}

	.card-description {
		font-size: 14px;
		line-height: 20px;
		color: #536471;
		margin: 0;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.service-card.dark .card-description {
		color: #71767b;
	}

	@media (max-width: 768px) {
		.card-image {
			height: 160px;
		}

		.card-name {
			font-size: 15px;
		}

		.card-description {
			font-size: 13px;
		}
	}
</style>
