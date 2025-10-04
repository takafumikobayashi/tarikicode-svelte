<script>
	// appConfig.jsなどからサイト全体の設定情報をインポート
	import { AppConfig } from '$lib/AppConfig';
</script>

<svelte:head>
	<title>{AppConfig.title}</title>
	<meta name="description" content={AppConfig.description} />
</svelte:head>

<main>
	<slot />
</main>

<style>
	main {
		position: relative;
		max-width: 80em;
		padding: 1em;
		margin: 1em auto;
		box-sizing: border-box;
	}
</style>
