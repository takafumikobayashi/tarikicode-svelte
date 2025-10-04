<script lang="ts">
	import { onMount } from 'svelte';
	import IconButton from '@smui/icon-button';
	import { setMermaidTheme } from './Mermaid'; // Mermaidテーマを管理する関数をインポート
	import { lightThemeStore } from './themeStore';

	let lightTheme =
		typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;

	onMount(() => {
		// ローカルストレージからテーマ設定を読み込む
		lightTheme =
			localStorage.getItem('lightTheme') === 'true' ||
			(localStorage.getItem('lightTheme') === null &&
				window.matchMedia('(prefers-color-scheme: light)').matches);
		updateTheme();
	});

	function switchTheme() {
		lightTheme = !lightTheme;
		localStorage.setItem('lightTheme', lightTheme.toString()); // ローカルストレージに保存
		let themeLink = document.head.querySelector('#theme');

		if (!themeLink) {
			themeLink = document.createElement('link');
			// @ts-ignore
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
		}

		// @ts-ignore
		themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;

		// @ts-ignore
		document.head
			.querySelector('link[href="/smui-dark.css"]')
			.insertAdjacentElement('afterend', themeLink);

		// Mermaidテーマを即座に反映させる
		setMermaidTheme(!lightTheme); // テーマ切り替え時にMermaidテーマを即時に変更
		lightThemeStore.set(lightTheme);
	}

	function updateTheme() {
		let themeLink = document.head.querySelector('#theme');

		if (!themeLink) {
			themeLink = document.createElement('link');
			// @ts-ignore
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
			document.head.append(themeLink);
		}

		// @ts-ignore
		themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;

		// Mermaidテーマを即座に反映させる
		setMermaidTheme(!lightTheme); // 初回ロード時にもMermaidテーマを設定
		lightThemeStore.set(lightTheme);
	}
</script>

<IconButton class="material-icons" on:click={() => switchTheme()}>
	{lightTheme ? 'dark_mode' : 'light_mode'}
</IconButton>
