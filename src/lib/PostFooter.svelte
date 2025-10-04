<script lang="ts">
	import Fab, { Label, Icon } from '@smui/fab';
	import { Cell } from '@smui/layout-grid';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	let likes = writable(0);
	let pageUrl = '';
	let isLiked = writable(false); // ユーザーが「いいね」したかどうかを管理
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

	// サーバーから「いいね」数を取得し、ローカルにキャッシュ
	async function fetchLikesFromServer() {
		try {
			const response = await fetch(
				`${import.meta.env.VITE_LAMBDA_SERVER_URL}?url=${encodeURIComponent(pageUrl)}`
			);
			const data = await response.json();
			if (data && data.last_updated !== null) {
				likes.set(data.likes);
				// ローカルに「いいね」数とタイムスタンプを保存
				localStorage.setItem(`likes_${pageUrl}`, data.likes);
				localStorage.setItem(`likes_timestamp_${pageUrl}`, Date.now().toString());
			} else {
				await addNewPageLikes();
				likes.set(0);
				localStorage.setItem(`likes_${pageUrl}`, '0');
				localStorage.setItem(`likes_timestamp_${pageUrl}`, Date.now().toString());
			}
		} catch (error) {
			console.error('Error fetching likes:', error);
		}
	}

	// ページが新規の場合、サーバーに初期化リクエスト
	async function addNewPageLikes() {
		try {
			await fetch(import.meta.env.VITE_LAMBDA_SERVER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'initialize',
					url: pageUrl
				})
			});
		} catch (error) {
			console.error('Error adding new page likes:', error);
		}
	}

	// 「いいね」ボタンをクリック
	async function incrementLikes() {
		const liked = getCookie(`liked_${pageUrl}`);
		if (liked) {
			// 既に「いいね」している場合、ボタンを無効化
			return;
		}

		// 現在の「いいね」数をインクリメント
		const newLikes = $likes + 1;

		// サーバーに更新をリクエスト
		try {
			await fetch(import.meta.env.VITE_LAMBDA_SERVER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'update',
					url: pageUrl,
					likes: newLikes
				})
			});
			likes.set(newLikes); // クリック後に新しい値をセット

			// クッキーに「いいね」済みの情報を保存
			setCookie(`liked_${pageUrl}`, 'true', 365); // クッキーの有効期限は365日

			// ユーザーが「いいね」した状態にする
			isLiked.set(true);

			// ローカルに「いいね」数を更新
			localStorage.setItem(`likes_${pageUrl}`, newLikes.toString());
			localStorage.setItem(`likes_timestamp_${pageUrl}`, Date.now().toString());
		} catch (error) {
			console.error('Error incrementing likes:', error);
			// エラー時はローカル更新を巻き戻す
			likes.set(newLikes - 1);
			isLiked.set(false);
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
		if (parts.length === 2) return parts.pop().split(';').shift();
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
						on:click={incrementLikes}
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
	</div>
</div>

<style>
	.post-footer {
		margin-top: 100px;
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
</style>
