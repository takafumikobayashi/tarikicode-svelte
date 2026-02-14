<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import WorkCard from './WorkCard.svelte';
	import { AppConfig } from './AppConfig';

	const works = [
		{
			name: 'ThanksCard',
			subtitle: '組織のコミュニケーションとワークエンゲージメントを高めるためのデジタル活用',
			description:
				'MicrosoftTeamsとPowerAutomate、AdaptiveCardを活用しシンプルなソリューションとアイデアを提供しています。',
			slug: 'thanks-card',
			image: AppConfig.post_string['thanks-card']
		},
		{
			name: 'kintone',
			subtitle: 'プラグイン開発者として、効率的なQRコードリーディングソリューションを提供',
			description:
				'子どもの第三の居場所提供を行う事業にて、kintoneを活用したデータ管理と入退室の管理をデジタル化しています。',
			slug: 'kintone-plugin',
			image: AppConfig.post_string['kintone-plugin']
		},
		{
			name: 'Svelte',
			subtitle: '軽量でモダンなフレームワークを使ったWebアプリケーション開発',
			description:
				'Node.jsエンジニアとしてフロントエンドの開発を行っています。このサイトはsveltekitを使って構築しています。',
			slug: 'svelte',
			image: AppConfig.post_string['svelte']
		},
		{
			name: 'SNS Promotion',
			subtitle: '京都・奈良の日本美を発信するフォロワー1万人超インスタグラマー',
			description:
				'SNS発信を行う上でのターゲット戦略やアカウントテーマ、フォロワーコミュニケーションのノウハウを提供します。',
			slug: 'sns-promotion',
			image: AppConfig.post_string['sns-promotion']
		},
		{
			name: 'AI Agent',
			subtitle: 'AIエージェントの力で組織を変革する──2026年の実践ガイド',
			description:
				'Claude Codeによるサイト構築、Cbriefの開発、AI記事自動生成パイプラインなど、実体験に基づくAI活用の実践ガイド。',
			slug: '2026-02-14-ai-transformation-2026',
			image: AppConfig.post_string['2026-02-14-ai-transformation-2026']
		},
		{
			name: 'Project Management',
			subtitle: '組織課題を適応性と再現性で解決するプロジェクトマネジメント',
			description:
				'暗号資産トレードアプリやモバイル業界の大規模PMなど豊富な経験を踏まえた知見とノウハウを提供します。',
			slug: 'project-management',
			image: AppConfig.post_string['project-management']
		}
	];
</script>

<svelte:head>
	{#each works as work}
		{#if work.image}
			<link rel="preload" as="image" href={work.image} />
		{/if}
	{/each}
</svelte:head>

<LayoutGrid>
	{#each works as work}
		<Cell span={4}>
			<div class="demo-cell">
				<WorkCard
					name={work.name}
					subtitle={work.subtitle}
					description={work.description}
					slug={work.slug}
					image={work.image}
				/>
			</div>
		</Cell>
	{/each}
</LayoutGrid>

<style>
	.demo-cell {
		width: 100%;
		margin-top: 1em;
		margin-bottom: 1em;
		display: flex;
		justify-content: center;
		align-items: stretch;
	}
</style>
