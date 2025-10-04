<script lang="ts">
	import IconButton, { Icon } from '@smui/icon-button';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import {
		twitterLink,
		githubLink,
		linkedinLink,
		facebookLink,
		instagramLink
	} from './CommonFunction';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Button, { Label } from '@smui/button';
	import PrivacyPolicy from './PrivacyPolicy.svelte';

	let open = false;
</script>

<LayoutGrid>
	<Cell span={12}>
		<div class="demo-cell">
			<div class="profile-image">
				<img
					src="https://d1mt09hgbl7gpz.cloudfront.net/icon/icon-256x256.png"
					alt="プロフィール画像"
				/>
			</div>
		</div>
		<div class="demo-cell">
			<div class="mdc-typography--headline5">他力code</div>
			<div class="mdc-typography--body2">Minami-Kasai, Edogawa, Tokyo, JAPAN</div>
			<div class="mdc-typography--caption">https://tariki-code.tokyo/</div>
		</div>
		<div class="demo-cell">
			<IconButton ripple={false} on:click={() => twitterLink()}>
				<Icon tag="svg" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
					/>
				</Icon>
			</IconButton>
			<IconButton ripple={false} on:click={() => githubLink()}>
				<Icon tag="svg" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
					/>
				</Icon>
			</IconButton>
			<IconButton ripple={false} on:click={() => linkedinLink()}>
				<Icon tag="svg" viewBox="0 0 16 16">
					<path
						fill="currentColor"
						d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401m-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4"
					/>
				</Icon>
			</IconButton>
			<IconButton ripple={false} on:click={() => facebookLink()}>
				<Icon tag="svg" viewBox="0 0 16 16">
					<path
						fill="currentColor"
						d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"
					/>
				</Icon>
			</IconButton>
			<IconButton ripple={false} on:click={() => instagramLink()}>
				<Icon tag="svg" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
					/>
				</Icon>
			</IconButton>
		</div>
		<div class="demo-cell">
			<Button color="secondary" on:click={() => (open = true)}>
				<Label><div class="mdc-typography--caption">プライバシーポリシー</div></Label>
			</Button>
		</div>
	</Cell>
</LayoutGrid>

<Dialog
	bind:open
	aria-labelledby="large-scroll-title"
	aria-describedby="large-scroll-content"
	surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
	<Title id="large-scroll-title">Privacy Statement of tariki-code</Title>
	<Content id="large-scroll-content">
		<PrivacyPolicy />
	</Content>
	<Actions>
		<Button action="accept">
			<Label>閉じる</Label>
		</Button>
	</Actions>
</Dialog>

<style>
	.demo-cell {
		width: 100%;
		margin-top: 2em;
		margin-bottom: 2em;
	}

	.profile-image img {
		/* 画像のサイズを設定 */
		width: 200px; /* 例: 100px */
		height: 200px; /* 画像を正方形にするため、幅と同じ値に設定 */

		/* 画像を丸く表示 */
		border-radius: 50%;

		/* 画像の枠線（オプション） */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 軽い影を追加 */
	}
</style>
