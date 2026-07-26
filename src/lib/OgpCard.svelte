<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	// 記事本文の [[ogp:URL|画像|タイトル|説明|サイト名]] から渡される
	export let url: string;
	export let fallbackImage = '';
	export let fallbackTitle = '';
	export let fallbackDesc = '';
	export let fallbackSite = '';

	interface OgpData {
		title: string;
		description: string;
		image: string;
		siteName: string;
		url: string;
	}

	// APIが応答を返さない場合の打ち切り時間。
	// サーバ側の外部フェッチも5秒でタイムアウトする設定に合わせている
	const FETCH_TIMEOUT_MS = 5000;

	let ogpData: OgpData | null = null;
	let loading = true;
	// 画像の読み込みに失敗したか（配信元が外部からの埋め込みを拒否する場合がある）
	let imageFailed = false;
	// 破棄済みかどうか（破棄に伴う中断はエラーとして記録しない）
	let destroyed = false;
	// 進行中のリクエストを中断する処理。完了後はnullに戻す
	let cancelInFlightRequest: (() => void) | null = null;

	// APIから返るHTMLエンティティ（&amp; 等）を実体に戻す
	// 表示時のエスケープはSvelteのテンプレートが行うため、ここでは行わない
	function htmlDecode(value: string): string {
		if (!value) return '';
		const el = document.createElement('textarea');
		el.innerHTML = value;
		return el.value;
	}

	// javascript: などのスキームを描画に載せない
	function safeHttpUrl(value: string): string {
		return value && /^https?:\/\//.test(value) ? value : '';
	}

	onMount(async () => {
		// APIが応答を返さない場合でも「読み込み中」で固まらないよう、
		// クライアント側からも打ち切れるようにする
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
		// ページ離脱時に呼べるよう、中断手段を外へ出しておく
		cancelInFlightRequest = () => {
			clearTimeout(timeoutId);
			controller.abort();
		};

		try {
			const response = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`, {
				signal: controller.signal
			});

			if (response.ok) {
				ogpData = await response.json();
			} else {
				// PDFなどHTML以外のURLはAPIが4xxを返す。想定内の結果なので例外にはしない
				console.warn(`OGP情報を取得できませんでした (HTTP ${response.status}): ${url}`);
			}
		} catch (err) {
			// 通信断・タイムアウトなど。ogpData は null のままなので、下の renderable 判定で
			// フォールバック値の有無に応じてカードかリンクかが決まる。
			// ページ離脱に伴う中断は異常ではないので記録しない
			if (!destroyed) {
				console.warn(`OGP情報の取得に失敗しました: ${url}`, err);
			}
		} finally {
			// 成功・失敗・打ち切りのいずれでも必ず通るため、ここでタイマーを解除する。
			// カードは1記事に複数並ぶので、消し残すとページ単位で積み上がる
			clearTimeout(timeoutId);
			cancelInFlightRequest = null;
			loading = false;
		}
	});

	// ページ離脱時、未完了のリクエストとタイマーを残さない。
	// 1記事に複数のカードが並ぶため、放置すると離脱後も通信が続く
	onDestroy(() => {
		destroyed = true;
		cancelInFlightRequest?.();
	});

	// API値を優先し、空ならMarkdown側で指定されたフォールバック値を使う。
	// フォールバック値もデコードする（記事に &amp; を含むURLが貼られた場合に壊れるため）
	$: title = htmlDecode(ogpData?.title ?? '') || htmlDecode(fallbackTitle);
	$: description = htmlDecode(ogpData?.description ?? '') || htmlDecode(fallbackDesc);
	$: siteName = htmlDecode(ogpData?.siteName ?? '') || htmlDecode(fallbackSite);
	$: image =
		safeHttpUrl(htmlDecode(ogpData?.image ?? '')) || safeHttpUrl(htmlDecode(fallbackImage));

	// カードとして成立するのは、画像かタイトルのいずれかが揃った場合のみ。
	// それ以外はURLだけのリンクにフォールバックする
	$: renderable = Boolean(image || title);
	$: href = safeHttpUrl(url);
</script>

{#if loading}
	<div class="ogp-loading">読み込み中...</div>
{:else if renderable}
	<a {href} target="_blank" rel="noopener noreferrer" class="ogp-link-card">
		<div class="ogp-card-wrapper">
			{#if image && !imageFailed}
				<div class="ogp-card-image">
					<!-- 配信元がCORP等で外部埋め込みを拒否する画像があるため、失敗したら枠ごと隠す -->
					<img src={image} alt={title} on:error={() => (imageFailed = true)} />
				</div>
			{/if}
			<div class="ogp-card-text">
				<h3 class="ogp-card-title">{title || url}</h3>
				{#if description}
					<p class="ogp-card-description">{description}</p>
				{/if}
				{#if siteName}
					<p class="ogp-card-site">{siteName}</p>
				{/if}
			</div>
		</div>
	</a>
{:else}
	<a {href} target="_blank" rel="noopener noreferrer" class="ogp-error-link">{url}</a>
{/if}

<style>
	.ogp-loading {
		padding: 1em;
		text-align: center;
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
	}

	.ogp-link-card {
		display: block;
		text-decoration: none;
		color: inherit;
		margin: 1.5em 0;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.12));
		border-radius: 12px;
		overflow: hidden;
		transition: all 0.2s;
	}

	.ogp-link-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
		border-color: var(--mdc-theme-primary, #6200ee);
	}

	.ogp-card-wrapper {
		display: flex;
		gap: 1em;
		padding: 1em;
	}

	.ogp-card-image {
		flex-shrink: 0;
		width: 200px;
		height: 120px;
		overflow: hidden;
		border-radius: 8px;
		background-color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.06));
	}

	.ogp-card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ogp-card-text {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		min-width: 0;
	}

	.ogp-card-title {
		margin: 0;
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.4;
		color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));
		overflow: hidden;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.ogp-card-description {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
		overflow: hidden;
		display: -webkit-box;
		line-clamp: 2;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.ogp-card-site {
		margin: 0;
		font-size: 0.8rem;
		color: var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38));
	}

	.ogp-error-link {
		display: block;
		padding: 1em;
		margin: 1.5em 0;
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.12));
		border-radius: 8px;
		color: var(--mdc-theme-primary, #6200ee);
		word-break: break-all;
	}

	/* モバイル対応 */
	@media (max-width: 768px) {
		.ogp-card-wrapper {
			flex-direction: column;
		}

		.ogp-card-image {
			width: 100%;
			height: 180px;
		}
	}
</style>
