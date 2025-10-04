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
</style>
