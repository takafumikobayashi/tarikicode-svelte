<script>
	import Card, { Content, PrimaryAction, Media } from '@smui/card';
	import {
		thanksCardLink,
		kintoneLink,
		svelteLink,
		snsPromotionLink,
		aiLink,
		projectManagementLink
	} from './CommonFunction';
	import { AppConfig } from './AppConfig';

	// AppConfigから画像URLを取得
	const cardImages = [
		AppConfig.post_string['thanks-card'],
		AppConfig.post_string['kintone-plugin'],
		AppConfig.post_string['svelte'],
		AppConfig.post_string['sns-promotion'],
		AppConfig.post_string['ai'],
		AppConfig.post_string['project-management']
	];
</script>

<svelte:head>
	{#each cardImages as image}
		<link rel="preload" as="image" href={image} />
	{/each}
</svelte:head>

<div
	class="card-display"
	style="
		--card-image-1: url({cardImages[0]});
		--card-image-2: url({cardImages[1]});
		--card-image-3: url({cardImages[2]});
		--card-image-4: url({cardImages[3]});
		--card-image-5: url({cardImages[4]});
		--card-image-6: url({cardImages[5]});
	"
>
	<div class="card-container">
		<Card>
			<div style="padding: 1rem;">
				<h2 class="mdc-typography--headline6" style="margin: 0;">ThanksCard</h2>
				<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
					組織のコミュニケーションとワークエンゲージメントを高めるためのデジタル活用
				</h3>
			</div>
			<PrimaryAction on:click={() => thanksCardLink()}>
				<Media class="card-media-16x9" aspectRatio="16x9" />
				<Content class="mdc-typography--body2">
					MicrosoftTeamsとPowerAutomate、AdaptiveCardを活用しシンプルなソリューションとアイデアを提供しています。
				</Content>
			</PrimaryAction>
		</Card>
	</div>

	<div class="card-container">
		<Card>
			<div style="padding: 1rem;">
				<h2 class="mdc-typography--headline6" style="margin: 0;">kintone</h2>
				<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
					プラグイン開発者として、効率的なQRコードリーディングソリューションを提供
				</h3>
			</div>
			<PrimaryAction on:click={() => kintoneLink()}>
				<Media class="card-media-16x9-2" aspectRatio="16x9" />
				<Content class="mdc-typography--body2">
					子どもの第三の居場所提供を行う事業にて、kintoneを活用したデータ管理と入退室の管理をデジタル化しています。
				</Content>
			</PrimaryAction>
		</Card>
	</div>

	<div class="card-container">
		<Card>
			<div style="padding: 1rem;">
				<h2 class="mdc-typography--headline6" style="margin: 0;">Svelte</h2>
				<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
					軽量でモダンなフレームワークを使ったWebアプリケーション開発
				</h3>
			</div>
			<PrimaryAction on:click={() => svelteLink()}>
				<Media class="card-media-16x9-3" aspectRatio="16x9" />
				<Content class="mdc-typography--body2">
					Node.jsエンジニアとしてフロントエンドの開発を行っています。このサイトはsveltekitを使って構築しています。
				</Content>
			</PrimaryAction>
		</Card>
	</div>

	<div class="card-container">
		<Card>
			<div style="padding: 1rem;">
				<h2 class="mdc-typography--headline6" style="margin: 0;">SNS Promotion</h2>
				<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
					京都・奈良の日本美を発信するフォロワー1万人超インスタグラマー
				</h3>
			</div>
			<PrimaryAction on:click={() => snsPromotionLink()}>
				<Media class="card-media-16x9-4" aspectRatio="16x9" />
				<Content class="mdc-typography--body2">
					SNS発信を行う上でのターゲット戦略やアカウントテーマ、フォロワーコミュニケーションのノウハウを提供します。
				</Content>
			</PrimaryAction>
		</Card>
	</div>

	<div class="card-container">
		<Card>
			<div style="padding: 1rem;">
				<h2 class="mdc-typography--headline6" style="margin: 0;">AI</h2>
				<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
					ChatGPTやClaudeの業務利活用、MidjournyやDALL-Eを使ったクリエイティブ活用
				</h3>
			</div>
			<PrimaryAction on:click={() => aiLink()}>
				<Media class="card-media-16x9-5" aspectRatio="16x9" />
				<Content class="mdc-typography--body2">
					開発シーンにおけるAIを活用した問題解決ノウハウを提供します。このサイトではMidjourny生成画像を活用しています。
				</Content>
			</PrimaryAction>
		</Card>
	</div>

	<div class="card-container">
		<Card>
			<div style="padding: 1rem;">
				<h2 class="mdc-typography--headline6" style="margin: 0;">Project Management</h2>
				<h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
					組織課題を適応性と再現性で解決するプロジェクトマネジメント
				</h3>
			</div>
			<PrimaryAction on:click={() => projectManagementLink()}>
				<Media class="card-media-16x9-6" aspectRatio="16x9" />
				<Content class="mdc-typography--body2">
					暗号資産トレードアプリやモバイル業界の大規模PMなど豊富な経験を踏まえた知見とノウハウを提供します。
				</Content>
			</PrimaryAction>
		</Card>
	</div>
</div>

<style>
	.card-display {
		display: flex;
		flex-wrap: wrap;
		justify-content: center; /* カードを中央揃えにしたい場合 */
		gap: 30px; /* カード間のスペース */
	}

	.card-container {
		flex: 1; /* 各カードがフレキシブルに空間を埋めるように */
		min-width: 280px; /* カードの最小幅 */
		max-width: 380px; /* カードの最大幅 */
		background-color: var(--mdc-theme-background, #f8f8f8);
		border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
		padding: 20px;
	}

	:global(.card-media-16x9) {
		background-image: var(--card-image-1);
		height: 180px;
	}

	:global(.card-media-16x9-2) {
		background-image: var(--card-image-2);
		height: 180px;
	}

	:global(.card-media-16x9-3) {
		background-image: var(--card-image-3);
		height: 180px;
	}

	:global(.card-media-16x9-4) {
		background-image: var(--card-image-4);
		height: 180px;
	}

	:global(.card-media-16x9-5) {
		background-image: var(--card-image-5);
		height: 180px;
	}

	:global(.card-media-16x9-6) {
		background-image: var(--card-image-6);
		height: 180px;
	}

	@media (max-width: 480px) {
		:global(.card-container) {
			margin-right: 0;
			padding-right: 0;
			padding-left: 0;
		}
	}
</style>
