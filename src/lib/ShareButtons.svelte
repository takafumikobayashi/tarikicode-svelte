<script lang="ts">
	import { AppConfig } from '$lib/AppConfig';
	import IconButton, { Icon } from '@smui/icon-button';

	export let url: string;
	export let title: string;

	let showSnackbar = false;

	// 現在のページのURLを使用（相対URLの場合は絶対URLに変換）
	$: absoluteUrl = url.startsWith('http') ? url : `${AppConfig.url}${url}`;
	$: encodedUrl = encodeURIComponent(absoluteUrl);
	$: encodedTitle = encodeURIComponent(title);

	// 各SNSのシェアURL
	$: twitterUrl = `${AppConfig.shareUrls.twitter}?url=${encodedUrl}&text=${encodedTitle}&via=${AppConfig.xaccuont.replace('@', '')}`;
	$: facebookUrl = `${AppConfig.shareUrls.facebook}?u=${encodedUrl}`;
	$: linkedinUrl = `${AppConfig.shareUrls.linkedin}?url=${encodedUrl}`;
	$: hatenaUrl = `${AppConfig.shareUrls.hatena}${encodedUrl}`;
	$: pocketUrl = `${AppConfig.shareUrls.pocket}?url=${encodedUrl}&title=${encodedTitle}`;

	// 各SNSへのリンクを開く
	function openLink(link: string) {
		window.open(link, '_blank', 'noopener,noreferrer');
	}

	// クリップボードにコピー
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(absoluteUrl);
			showSnackbar = true;
			setTimeout(() => {
				showSnackbar = false;
			}, 3000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<div class="share-section">
	<div class="mdc-typography--headline6">この記事をシェアする</div>
	<div class="share-buttons">
		<IconButton ripple={false} on:click={() => openLink(twitterUrl)}>
			<Icon tag="svg" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
				/>
			</Icon>
		</IconButton>

		<IconButton ripple={false} on:click={() => openLink(facebookUrl)}>
			<Icon tag="svg" viewBox="0 0 16 16">
				<path
					fill="currentColor"
					d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
				/>
			</Icon>
		</IconButton>

		<IconButton ripple={false} on:click={() => openLink(linkedinUrl)}>
			<Icon tag="svg" viewBox="0 0 16 16">
				<path
					fill="currentColor"
					d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401m-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4"
				/>
			</Icon>
		</IconButton>

		<IconButton ripple={false} on:click={() => openLink(hatenaUrl)}>
			<Icon tag="svg" viewBox="0 0 300 300">
				<text
					x="50%"
					y="50%"
					text-anchor="middle"
					dominant-baseline="central"
					font-size="200"
					font-weight="bold"
					fill="currentColor">B!</text
				>
			</Icon>
		</IconButton>

		<IconButton ripple={false} on:click={() => openLink(pocketUrl)}>
			<Icon tag="svg" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M18.813 10c0-.44-.36-.8-.8-.8H5.987c-.44 0-.8.36-.8.8 0 1.76.714 3.354 1.868 4.51C8.21 15.664 9.8 16.38 11.56 16.38s3.35-.715 4.505-1.87C17.22 13.354 17.933 11.76 17.933 10zm4.007-7c0-.44-.36-.8-.8-.8H1.98c-.44 0-.8.36-.8.8 0 .44.36.8.8.8h20.04c.44 0 .8-.36.8-.8zm-2.005 3H1.98c-.44 0-.8.36-.8.8v4.2c0 2.873 1.168 5.478 3.05 7.36C5.902 20.032 8.507 21.2 11.38 21.2s5.478-1.168 7.36-3.05c1.882-1.882 3.05-4.487 3.05-7.36V6.8c0-.44-.36-.8-.8-.8h-.175z"
				/>
			</Icon>
		</IconButton>

		<IconButton ripple={false} on:click={copyToClipboard}>
			<Icon tag="svg" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1M8 13h8v-2H8zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5"
				/>
			</Icon>
		</IconButton>
	</div>
</div>

{#if showSnackbar}
	<div class="snackbar-overlay">
		<div class="snackbar">URLをコピーしました</div>
	</div>
{/if}

<style>
	.share-section {
		width: 100%;
		margin-top: 2em;
		margin-bottom: 2em;
		padding: 2em 0;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
		text-align: center;
	}

	.share-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
		flex-wrap: wrap;
		margin-top: 1em;
	}

	/* IconButtonのスタイル調整 */
	:global(.share-buttons .mdc-icon-button) {
		color: var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));
		width: 56px;
		height: 56px;
		padding: 8px;
	}

	:global(.share-buttons .mdc-icon-button svg) {
		width: 32px;
		height: 32px;
	}

	/* Snackbarのスタイル */
	.snackbar-overlay {
		position: fixed;
		bottom: 2em;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9999;
		pointer-events: none;
	}

	.snackbar {
		background-color: #323232;
		color: white;
		padding: 1em 1.5em;
		border-radius: 4px;
		box-shadow:
			0 3px 5px -1px rgba(0, 0, 0, 0.2),
			0 6px 10px 0 rgba(0, 0, 0, 0.14),
			0 1px 18px 0 rgba(0, 0, 0, 0.12);
		font-size: 0.875rem;
		animation: slideUp 0.3s ease-out;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* モバイル対応 */
	@media (max-width: 768px) {
		.share-section {
			margin-top: 1.5em;
			margin-bottom: 1.5em;
			padding: 1.5em 0;
		}
	}
</style>
