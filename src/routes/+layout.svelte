<script>
	// appConfig.jsなどからサイト全体の設定情報をインポート
	import { AppConfig } from '#lib/AppConfig.js';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import '#lib/styles/reveal.css';
	import Header from '#lib/Header.svelte';

	// 初回ナビゲーションフラグ（二重送信を防ぐ）
	let isFirstNavigation = true;

	// ページ遷移時にGoogle Analyticsにページビューを送信
	afterNavigate(({ shallow, type }) => {
		if (shallow && type === 'goto') return;

		// 初回ナビゲーションはスキップ（app.htmlで既に送信済み）
		if (isFirstNavigation) {
			isFirstNavigation = false;
			return;
		}

		if (typeof window !== 'undefined' && window.gtag) {
			window.gtag('config', 'G-ZYB8P4GTXY', {
				page_path: page.url.pathname,
				page_title: document.title
			});
		}
	});
</script>

<svelte:head>
	<title>{AppConfig.title}</title>
	<meta name="description" content={AppConfig.description} />
</svelte:head>

<main>
	<!-- ヘッダーはページ遷移で破棄しない。各ページに置くと遷移のたびに再作成され、
	     SMUI 8のMenuが破棄処理中に要素のない状態でイベントを送って例外になり、遷移が500になっていた -->
	<Header />
	<slot></slot>
</main>

<style>
	main {
		position: relative;
		max-width: 80em;
		padding: 1em;
		margin: 1em auto;
		box-sizing: border-box;
		min-height: 100vh;
	}

	@media (max-width: 768px) {
		main {
			padding: 0.5em;
			margin: 0.5em auto;
		}
	}
</style>
