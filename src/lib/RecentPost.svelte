<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { onMount, tick } from 'svelte';
	import { lightThemeStore } from '$lib/themeStore';

	const TWITTER_WIDGET_URL = 'https://platform.twitter.com/widgets.js';
	let theme = 'light';
	let tweetUrls: string[] = [];

	$: theme = $lightThemeStore ? 'light' : 'dark';

	const loadWidgets = () => {
		const twttr = (window as typeof window & { twttr?: { widgets?: { load?: () => void } } })
			.twttr;
		twttr?.widgets?.load?.();
	};

	onMount(async () => {
		if (typeof window === 'undefined') {
			return;
		}

		// JSONファイルから最新ツイートURLを読み込み
		try {
			const response = await fetch('/recent-tweets.json');
			const data = await response.json();
			tweetUrls = data.tweets;
		} catch (error) {
			console.error('Failed to load recent tweets:', error);
			tweetUrls = []; // フォールバック
		}

		const unsubscribe = lightThemeStore.subscribe(async () => {
			await tick();
			loadWidgets();
		});

		const existing = document.querySelector<HTMLScriptElement>(
			`script[src="${TWITTER_WIDGET_URL}"]`
		);

		const cleanup = () => {
			unsubscribe();
		};

		if (existing) {
			if ((window as typeof window & { twttr?: unknown }).twttr) {
				loadWidgets();
			} else {
				existing.addEventListener('load', loadWidgets, { once: true });
			}
			return cleanup;
		}

		const script = document.createElement('script');
		script.src = TWITTER_WIDGET_URL;
		script.async = true;
		script.charset = 'utf-8';
		script.addEventListener('load', loadWidgets, { once: true });
		document.body.appendChild(script);

		return cleanup;
	});
</script>

{#key theme}
	<LayoutGrid>
		{#each tweetUrls as tweetUrl, index}
			<Cell span={4} spanTablet={4} spanPhone={4}>
				<div class="demo-cell fade-in-item" style="animation-delay: {index * 0.2}s;">
					<blockquote class="twitter-tweet" data-theme={theme}>
						<a href={tweetUrl}>Tweet {index + 1}</a>
					</blockquote>
				</div>
			</Cell>
		{/each}
	</LayoutGrid>
{/key}

<style>
	.demo-cell {
		width: 100%;
		margin-top: 1em;
		margin-bottom: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* フェードインアニメーション */
	.fade-in-item {
		opacity: 0;
		animation: fadeInUp 0.6s ease-out forwards;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
