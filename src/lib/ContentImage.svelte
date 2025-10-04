<script>
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import { AppConfig } from './AppConfig';

	// @ts-ignore
	export let post_string;

	// 背景画像のURLを動的に計算
	//@ts-ignore
	$: backgroundImageUrl = AppConfig.post_string[post_string];
</script>

<div class="fade-in">
	<LayoutGrid>
		<Cell align="middle" span={12}>
			<div class="content-hero" style="background-image: url({backgroundImageUrl});" />
		</Cell>
	</LayoutGrid>
</div>

<style>
	.content-hero {
		margin-top: 60px; /* ヘッダーの高さに応じて調整 */
		align-items: center;
		position: relative;
		width: 100%;
		height: 25vh; /* ビューポートの高さに基づいた高さ */
		background-size: cover; /* 画像をカバーとして表示 */
		background-position: center; /* 中央に配置 */
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 20px; /* 角を丸くする */
	}
</style>
