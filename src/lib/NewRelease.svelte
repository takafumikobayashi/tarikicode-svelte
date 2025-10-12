<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
	import Ripple from '@smui/ripple';
	import { nr20241026Link } from './CommonFunction';

	// リリース情報の型定義
	type Release = {
		date: string;
		title: string;
		link?: () => void; // linkがオプショナル
	};

	// リリース情報のデータ
	const releases: Release[] = [
		{
			date: '2024.10.26',
			title: 'Power Platform Administrator 勉強会 #02にて登壇をさせていただきました。',
			link: nr20241026Link
		},
		{
			date: '2024.10.25',
			title: '三重県にある鳥羽商船高等専門学校にて、ゲスト講師を務めさせていただきます。'
			// linkなし
		}
	];

	// クリックハンドラー
	function handleClick(release: Release) {
		if (release.link) {
			release.link();
		}
	}

	// キーダウンハンドラー
	function handleKeydown(e: KeyboardEvent, release: Release) {
		if (e.key === 'Enter' && release.link) {
			release.link();
		}
	}
</script>

<div class="mdc-typography--body1">
	<!-- PC版テーブル表示 -->
	<div class="desktop-table">
		<DataTable stickyHeader table$aria-label="User list" style="width: 100%;">
			<Head>
				<Row>
					<Cell>Date</Cell>
					<Cell style="width: 100%;">Title</Cell>
				</Row>
			</Head>
			<Body>
				{#each releases as release}
					<Row>
						<Cell>{release.date}</Cell>
						<Cell>
							{#if release.link}
								<div
									use:Ripple={{ surface: true, color: 'primary' }}
									on:click={() => handleClick(release)}
									on:keydown={(e) => handleKeydown(e, release)}
									tabindex="0"
									role="button"
									class="clickable"
								>
									{release.title}
								</div>
							{:else}
								<div class="no-link">
									{release.title}
								</div>
							{/if}
						</Cell>
					</Row>
				{/each}
			</Body>
		</DataTable>
	</div>

	<!-- モバイル版カード表示 -->
	<div class="mobile-cards">
		{#each releases as release}
			<div class="release-card">
				<div class="release-date">{release.date}</div>
				{#if release.link}
					<div
						use:Ripple={{ surface: true, color: 'primary' }}
						on:click={() => handleClick(release)}
						on:keydown={(e) => handleKeydown(e, release)}
						tabindex="0"
						role="button"
						class="release-title clickable"
					>
						{release.title}
					</div>
				{:else}
					<div class="release-title no-link">
						{release.title}
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>

<style>
	div {
		padding: 10px;
		border-radius: 5px;
	}

	.clickable {
		cursor: pointer;
	}

	.no-link {
		cursor: default;
		opacity: 0.7;
	}

	/* デフォルトではモバイル版を非表示 */
	.mobile-cards {
		display: none;
	}

	/* レスポンシブ対応 */
	@media (max-width: 768px) {
		/* モバイルではテーブルを非表示にしてカードを表示 */
		.desktop-table {
			display: none;
		}

		.mobile-cards {
			display: block;
		}

		.release-card {
			background: #f7f9fa;
			border: 1px solid #e1e8ed;
			border-radius: 8px;
			padding: 16px;
			margin-bottom: 12px;
		}

		.release-date {
			font-size: 13px;
			color: #536471;
			font-weight: 600;
			margin-bottom: 8px;
		}

		.release-title {
			font-size: 14px;
			line-height: 1.5;
		}

		.release-title.clickable {
			color: #1d9bf0;
		}

		.release-title.no-link {
			color: #0f1419;
		}
	}

	/* ダークモード対応 */
	@media (max-width: 768px) {
		:global([data-theme='dark']) .release-card {
			background: #16181c;
			border-color: #2f3336;
		}

		:global([data-theme='dark']) .release-date {
			color: #71767b;
		}

		:global([data-theme='dark']) .release-title.no-link {
			color: #e7e9ea;
		}
	}
</style>
