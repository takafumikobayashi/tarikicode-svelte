<script lang="ts">
	import { lightThemeStore } from '$lib/themeStore';
	import Skills from './Skills.svelte';

	let isLightTheme = true;
	$: isLightTheme = $lightThemeStore;

	const careerHistory = [
		{
			year: '2023',
			period: '2023 - Present',
			company: '経済産業省',
			department: '大臣官房デジタルトランスフォーメーション室',
			role: 'Product Manager / Community Manager / IT Strategist',
			highlights: [
				'PowerPlatformを使った行政手続オンライン化システムのプロダクトマネジメント',
				'デジタルツールを活用したワークエンゲージメントと組織コミュニケーション活性化施策'
			]
		},
		{
			year: '2021',
			period: '2021 - 2023',
			company: 'bitbank株式会社',
			department: 'COE部門',
			role: 'Project Manager / Group Manager',
			highlights: [
				'暗号資産トレードアプリのUX継続的改善、トラベルルールなど規制対応に関する機能追加',
				'新規事業におけるライセンス取得に向けたプロジェクトマネジメント'
			]
		},
		{
			year: '2012',
			period: '2012 - 2021',
			company: 'ソフトバンク株式会社',
			department: 'Mobile IT Solution Unit',
			role: 'Engineering Manager / Project Manager',
			highlights: [
				'基地局建設工事に関する統合管理システムのプロジェクトマネージャー',
				'内製エンジニア組織のエンジアリングマネージャー'
			]
		},
		{
			year: '2005',
			period: '2005 - 2012',
			company: 'イー・モバイル株式会社',
			department: '出向',
			role: 'System Engineer / Assistant Manager',
			highlights: ['携帯電話事業の立ち上げ', '工事管理に関するシステム開発・運用']
		},
		{
			year: '2002',
			period: '2002 - 2005',
			company: 'イー・アクセス株式会社',
			department: '',
			role: 'Network Engineer / System Engineer',
			highlights: [
				'バックボーネットワーク構築エンジニア',
				'工事管理・顧客管理システムの開発・運用・大規模システム移行対応'
			]
		},
		{
			year: '1998',
			period: '1998 - 2002',
			company: '某SI企業',
			department: '',
			role: 'Programmer',
			highlights: [
				'製造業・流通業などに常駐するWebアプリプログラマー',
				'COBOLプログラムの2000年問題対応'
			]
		}
	];
</script>

<!-- Skills Section -->
<Skills />

<!-- Career Timeline Section -->
<div class="career-section">
	<div class="section-header">
		<h2 class="mdc-typography--headline5">Career History</h2>
		<p class="section-description mdc-typography--body1">Professional experience timeline</p>
	</div>

	<div class="timeline">
		{#each careerHistory as career, index}
			<div class="timeline-item" class:dark={!isLightTheme}>
				<div class="timeline-marker">
					<div class="timeline-dot"></div>
					{#if index < careerHistory.length - 1}
						<div class="timeline-line"></div>
					{/if}
				</div>
				<div class="timeline-content">
					<div class="timeline-header">
						<span class="timeline-year mdc-typography--body2">{career.year}</span>
						<span class="timeline-period mdc-typography--body2">{career.period}</span>
					</div>
					<h3 class="company-name mdc-typography--subtitle1">{career.company}</h3>
					{#if career.department}
						<p class="department mdc-typography--body2">{career.department}</p>
					{/if}
					<p class="role mdc-typography--body1">{career.role}</p>
					<ul class="highlights">
						{#each career.highlights as highlight}
							<li class="mdc-typography--body2">{highlight}</li>
						{/each}
					</ul>
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.career-section {
		margin-top: 48px;
		padding-top: 32px;
		border-top: 1px solid #d0d7de;
	}

	.section-header {
		margin-bottom: 32px;
	}

	.section-header h2 {
		margin: 0 0 8px 0;
		font-size: 24px;
		font-weight: 600;
	}

	.section-description {
		margin: 0;
		color: #656d76;
		font-size: 14px;
	}

	.timeline {
		position: relative;
		padding-left: 0;
	}

	.timeline-item {
		display: flex;
		gap: 24px;
		margin-bottom: 40px;
		position: relative;
	}

	.timeline-marker {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-shrink: 0;
	}

	.timeline-dot {
		width: 16px;
		height: 16px;
		background: #4b53bc;
		border: 3px solid #ffffff;
		border-radius: 50%;
		box-shadow: 0 0 0 2px #4b53bc;
		z-index: 2;
	}

	.timeline-item.dark .timeline-dot {
		background: #4b53bc;
		border-color: #0d1117;
		box-shadow: 0 0 0 2px #4b53bc;
	}

	.timeline-line {
		width: 2px;
		flex: 1;
		background: #d0d7de;
		margin-top: 4px;
	}

	.timeline-item.dark .timeline-line {
		background: #30363d;
	}

	.timeline-content {
		flex: 1;
		background: #f6f8fa;
		border: 1px solid #d0d7de;
		border-radius: 8px;
		padding: 20px;
		transition: all 0.2s ease;
	}

	.timeline-content:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.timeline-item.dark .timeline-content {
		background: #161b22;
		border-color: #30363d;
	}

	.timeline-item.dark .timeline-content:hover {
		box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
	}

	.timeline-header {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.timeline-year {
		display: inline-block;
		background: #4b53bc;
		color: #ffffff;
		padding: 4px 12px;
		border-radius: 12px;
		font-size: 13px;
		font-weight: 600;
	}

	.timeline-item.dark .timeline-year {
		background: #4b53bc;
		color: #ffffff;
	}

	.timeline-period {
		font-size: 13px;
		color: #656d76;
	}

	.timeline-item.dark .timeline-period {
		color: #8b949e;
	}

	.company-name {
		margin: 0 0 4px 0;
		font-size: 18px;
		font-weight: 600;
		color: #24292f;
	}

	.timeline-item.dark .company-name {
		color: #c9d1d9;
	}

	.department {
		margin: 0 0 8px 0;
		font-size: 13px;
		color: #656d76;
		font-style: italic;
	}

	.timeline-item.dark .department {
		color: #8b949e;
	}

	.role {
		margin: 0 0 12px 0;
		font-size: 14px;
		font-weight: 500;
		color: #4b53bc;
	}

	.timeline-item.dark .role {
		color: #4b53bc;
	}

	.highlights {
		margin: 0;
		padding-left: 20px;
		list-style: none;
	}

	.highlights li {
		position: relative;
		margin-bottom: 8px;
		font-size: 14px;
		line-height: 1.6;
		color: #24292f;
		padding-left: 12px;
	}

	.highlights li:before {
		content: '▸';
		position: absolute;
		left: 0;
		color: #4b53bc;
	}

	.timeline-item.dark .highlights li {
		color: #c9d1d9;
	}

	.timeline-item.dark .highlights li:before {
		color: #4b53bc;
	}

	.highlights li:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 768px) {
		.career-section {
			margin-top: 32px;
			padding-top: 24px;
		}

		.section-header h2 {
			font-size: 20px;
		}

		.section-description {
			font-size: 13px;
		}

		.timeline-item {
			gap: 16px;
			margin-bottom: 32px;
		}

		.timeline-content {
			padding: 16px;
		}

		.company-name {
			font-size: 16px;
		}

		.timeline-year {
			font-size: 12px;
			padding: 3px 10px;
		}

		.timeline-period {
			font-size: 12px;
		}

		.highlights li {
			font-size: 13px;
		}
	}
</style>
