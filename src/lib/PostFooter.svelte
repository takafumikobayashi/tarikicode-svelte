<script lang="ts">
	import Fab, { Label, Icon } from '@smui/fab';
	import { Cell } from '@smui/layout-grid';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import ShareButtons from './ShareButtons.svelte';

	export let url: string;
	export let title: string;

	let likes = writable(0);
	let pageUrl = '';
	let isLiked = writable(false); // ユーザーが「いいね」したかどうかを管理
	let isSending = false; // 送信中の連打を防ぐ
	const cacheDuration = 3600000; // キャッシュの有効期間: 1時間（ミリ秒単位）

	// ページのロード時に実行
	onMount(async () => {
		pageUrl = normalisePath(window.location.pathname);

		// 1. キャッシュされた「いいね」の数を確認
		const cachedLikes = localStorage.getItem(`likes_${pageUrl}`);
		const cachedTimestamp = localStorage.getItem(`likes_timestamp_${pageUrl}`);

		if (
			cachedLikes &&
			cachedTimestamp &&
			Date.now() - parseInt(cachedTimestamp) < cacheDuration
		) {
			// キャッシュが有効ならローカルデータを使う
			likes.set(parseInt(cachedLikes));
		} else {
			// 2. サーバーから「いいね」数を取得
			await fetchLikesFromServer();
		}

		// 3. ユーザーが「いいね」済みかを確認（クッキーで保存）
		const liked = getCookie(`liked_${pageUrl}`);
		if (liked) {
			isLiked.set(true);
		}
	});

	// 表示する「いいね」数を更新し、ローカルにキャッシュ
	function setLikes(count: number) {
		likes.set(count);
		localStorage.setItem(`likes_${pageUrl}`, count.toString());
		localStorage.setItem(`likes_timestamp_${pageUrl}`, Date.now().toString());
	}

	// サーバーから「いいね」数を取得する
	// 記録のないページは likes: 0 が返るので、そのまま0を表示する
	async function fetchLikesFromServer() {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_LAMBDA_SERVER_URL}?url=${encodeURIComponent(pageUrl)}`
			);
			// fetch は 4xx/5xx でも例外を投げないため、ステータスを確認する
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			const data = await response.json();
			setLikes(Number(data.likes) || 0);
		} catch (error) {
			console.error('Error fetching likes:', error);
		}
	}

	// 「いいね」ボタンをクリック
	async function incrementLikes() {
		if (getCookie(`liked_${pageUrl}`) || isSending) {
			return;
		}
		isSending = true;

		try {
			const response = await fetch(import.meta.env.VITE_LAMBDA_SERVER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ type: 'update', url: pageUrl })
			});
			if (!response.ok) {
				// サーバーが受け付けなかった場合は表示を変えない（ボタンも押せるまま）
				throw new Error(`HTTP ${response.status}`);
			}
			// 表示はサーバーが返した数に合わせる。
			// alreadyLiked（別のブラウザなどで既にいいね済み）のときも、数は増やさず「いいね済み」にする
			const data = await response.json();
			setLikes(Number(data.likes) || 0);

			// クッキーに「いいね」済みの情報を保存（ボタンの色はこれで決まる）
			setCookie(`liked_${pageUrl}`, 'true', 365); // クッキーの有効期限は365日
			isLiked.set(true);
		} catch (error) {
			console.error('Error incrementing likes:', error);
		} finally {
			isSending = false;
		}
	}

	// クッキーを設定する関数
	function setCookie(name: string, value: string, days: number) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
	}

	// クッキーを取得する関数
	function getCookie(name: string) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift();
	}

	function normalisePath(pathname: string) {
		if (!pathname || pathname === '/') {
			return 'home';
		}
		return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
	}
</script>

<!-- レイアウト部分 -->
<div class="mdc-typography--body1 post-footer">
	<div class="content fade-in">
		<Cell span={12}>
			<div class="flexy">
				<div class="margins">
					<Fab
						color={$isLiked ? 'primary' : 'secondary'}
						onclick={incrementLikes}
						extended
						class="centered-fab"
						disabled={$isLiked}
					>
						<Icon class="material-icons" on>favorite</Icon>
						<Label>Likes: {$likes}</Label>
					</Fab>
				</div>
			</div>
		</Cell>
		<Cell span={12}>
			<ShareButtons {url} {title} />
		</Cell>
	</div>
</div>

<style>
	.post-footer {
		margin-top: 100px;
		margin-bottom: 2em;
		text-align: center;
	}

	.flexy {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.margins {
		margin: 10px;
	}

	:global(.centered-fab) {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		width: 100%;
	}

	@media (max-width: 768px) {
		.post-footer {
			margin-top: 3em;
			margin-bottom: 2em;
		}
	}
</style>
