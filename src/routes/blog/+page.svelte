<script lang="ts">
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Card, { Content as CardContent, Media } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import { AppConfig } from '$lib/AppConfig';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	// カテゴリ変更時の処理
	function onCategoryChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const category = target.value;
		if (category) {
			goto(`/blog?category=${encodeURIComponent(category)}`);
		} else {
			goto('/blog');
		}
	}

	// タグクリック時の処理
	function onTagClick(tag: string) {
		goto(`/blog?tag=${encodeURIComponent(tag)}`);
	}

	// ページネーション
	function goToPage(page: number) {
		const params = new URLSearchParams();
		if (data.selectedCategory) params.set('category', data.selectedCategory);
		if (data.selectedTag) params.set('tag', data.selectedTag);
		params.set('page', page.toString());
		goto(`/blog?${params.toString()}`);
	}

	// 日付フォーマット
	function formatDate(dateStr: string): string {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		return date.toLocaleDateString('ja-JP', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<meta property="og:title" content="Blog - {AppConfig.title}" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{AppConfig.url}/blog" />
	<meta property="og:image" content={AppConfig.post_string.about} />
	<meta property="og:description" content="ブログ記事一覧 - {AppConfig.description}" />
	<meta property="og:site_name" content={AppConfig.title} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={AppConfig.xaccuont} />
	<meta name="twitter:title" content="Blog - {AppConfig.title}" />
	<meta name="twitter:description" content="ブログ記事一覧 - {AppConfig.description}" />
	<meta name="twitter:image" content={AppConfig.post_string.about} />
</svelte:head>

<div class="mdc-typography--body1">
	<div class="content fade-in">
		<Header />

		<LayoutGrid>
			<Cell span={12}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Title>Blog</Title>
							<Subtitle>ブログ記事一覧</Subtitle>
							<Content>
								<!-- フィルター -->
								<div class="filter-section">
									<h3>カテゴリで絞り込み</h3>
									<div class="filter-controls">
										<div class="filter-item">
											<select
												id="category-select"
												class="mdc-select"
												value={data.selectedCategory || ''}
												on:change={onCategoryChange}
											>
												<option value="">すべて</option>
												{#each data.categories as category}
													<option value={category}>{category}</option>
												{/each}
											</select>
										</div>

										{#if data.selectedCategory || data.selectedTag}
											<div class="filter-item filter-item-button">
												<Button
													variant="outlined"
													on:click={() => goto('/blog')}
												>
													<Label>フィルタをクリア</Label>
												</Button>
											</div>
										{/if}
									</div>
								</div>

								<!-- タグクラウド -->
								{#if data.tags.length > 0}
									<div class="tags-section">
										<h3>タグ</h3>
										<div class="tag-cloud">
											{#each data.tags as tag}
												<button
													class="tag-chip"
													class:active={data.selectedTag === tag}
													on:click={() => onTagClick(tag)}
												>
													{tag}
												</button>
											{/each}
										</div>
									</div>
								{/if}

								<!-- 記事数表示 -->
								<div class="result-info">
									{#if data.selectedCategory || data.selectedTag}
										<p class="mdc-typography--body2">
											{data.totalPosts}件の記事が見つかりました
										</p>
									{:else}
										<p class="mdc-typography--body2">
											全{data.totalPosts}件の記事
										</p>
									{/if}
								</div>
							</Content>
						</Paper>
					</div>
				</div>
			</Cell>

			<!-- 記事一覧 -->
			{#each data.posts as post}
				<Cell span={4}>
					<div class="demo-cell">
						<Card variant="outlined" class="post-card">
							{#if post.image}
								<Media
									class="card-media"
									aspectRatio="16x9"
									style="background-image: url({post.image});"
								/>
							{/if}
							<CardContent>
								<h2 class="mdc-typography--headline6">{post.title}</h2>
								<div class="post-meta">
									<span class="mdc-typography--caption"
										>{formatDate(post.date)}</span
									>
									<span class="mdc-typography--caption category-badge"
										>{post.category}</span
									>
								</div>
								<p class="mdc-typography--body2 post-description">
									{post.description}
								</p>
								<div class="post-actions">
									<Button variant="outlined" href="/blog/{post.slug}">
										<Label>続きを読む</Label>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</Cell>
			{/each}

			<!-- ページネーション -->
			{#if data.totalPages > 1}
				<Cell span={12}>
					<div class="demo-cell pagination-container">
						<div class="pagination">
							<Button
								variant="outlined"
								disabled={data.currentPage === 1}
								on:click={() => goToPage(data.currentPage - 1)}
							>
								<Label>前へ</Label>
							</Button>

							<span class="page-info mdc-typography--body1">
								{data.currentPage} / {data.totalPages}
							</span>

							<Button
								variant="outlined"
								disabled={data.currentPage === data.totalPages}
								on:click={() => goToPage(data.currentPage + 1)}
							>
								<Label>次へ</Label>
							</Button>
						</div>
					</div>
				</Cell>
			{/if}
		</LayoutGrid>

		<Footer />
	</div>
</div>

<style>
	.demo-cell {
		width: 100%;
		margin-top: 2em;
		margin-bottom: 2em;
		display: flex;
		justify-content: center;
		align-items: stretch;
	}

	.filter-section {
		margin-bottom: 2em;
	}

	.filter-section h3 {
		margin-bottom: 0.5em;
		font-size: 1rem;
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
	}

	.filter-controls {
		display: flex;
		gap: 1em;
		flex-wrap: wrap;
		align-items: center;
	}

	.filter-item {
		min-width: 200px;
	}

	.filter-item-button {
		display: flex;
		align-items: center;
	}

	.mdc-select {
		width: 100%;
		padding: 0.75em 2.5em 0.75em 1em;
		border: 1px solid rgba(0, 0, 0, 0.23);
		border-radius: 4px;
		font-size: 1rem;
		font-family: Roboto, sans-serif;
		background-color: #fff;
		color: rgba(0, 0, 0, 0.87);
		cursor: pointer;
		transition: all 0.15s;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5em center;
		background-size: 1.5em;
	}

	.mdc-select option {
		background-color: #fff;
		color: rgba(0, 0, 0, 0.87);
	}

	.mdc-select:hover {
		border-color: rgba(0, 0, 0, 0.87);
	}

	.mdc-select:focus {
		outline: none;
		border-color: var(--mdc-theme-primary, #6200ee);
		border-width: 2px;
		padding: calc(0.75em - 1px) calc(2.5em - 1px) calc(0.75em - 1px) calc(1em - 1px);
	}

	:global([data-theme='dark']) .mdc-select {
		background-color: #333;
		border-color: rgba(255, 255, 255, 0.23);
		color: rgba(255, 255, 255, 0.87);
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23fff' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
	}

	:global([data-theme='dark']) .mdc-select option {
		background-color: #333;
		color: rgba(255, 255, 255, 0.87);
	}

	:global([data-theme='dark']) .mdc-select:hover {
		border-color: rgba(255, 255, 255, 0.87);
	}

	.tags-section {
		margin-bottom: 2em;
	}

	.tags-section h3 {
		margin-bottom: 0.5em;
		font-size: 1rem;
		color: var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.6));
	}

	.tag-cloud {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	.tag-chip {
		padding: 0.5em 1em;
		border: 1px solid rgba(0, 0, 0, 0.23);
		border-radius: 16px;
		background-color: #fff;
		color: rgba(0, 0, 0, 0.87);
		cursor: pointer;
		font-size: 0.875rem;
		transition:
			all 0.2s,
			transform 0.1s;
	}

	.tag-chip:hover {
		background-color: transparent;
		color: var(--mdc-theme-primary, #6200ee);
		border-color: var(--mdc-theme-primary, #6200ee);
	}

	.tag-chip:active {
		transform: scale(0.95);
	}

	.tag-chip.active {
		background-color: var(--mdc-theme-primary, #6200ee);
		color: white;
		border-color: var(--mdc-theme-primary, #6200ee);
	}

	:global([data-theme='dark']) .tag-chip {
		background-color: #424242;
		color: rgba(255, 255, 255, 0.87);
		border-color: rgba(255, 255, 255, 0.23);
	}

	:global([data-theme='dark']) .tag-chip:hover {
		background-color: transparent;
		color: var(--mdc-theme-primary, #6200ee);
		border-color: var(--mdc-theme-primary, #6200ee);
	}

	:global([data-theme='dark']) .tag-chip.active {
		background-color: var(--mdc-theme-primary, #6200ee);
		color: white;
		border-color: var(--mdc-theme-primary, #6200ee);
	}

	.result-info {
		margin-bottom: 1em;
	}

	:global(.post-card) {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	:global(.card-media) {
		background-size: cover;
		background-position: center;
	}

	.post-meta {
		display: flex;
		gap: 1em;
		margin: 0.5em 0;
		align-items: center;
	}

	.category-badge {
		background-color: var(--mdc-theme-primary, #6200ee);
		color: white;
		padding: 0.2em 0.6em;
		border-radius: 4px;
	}

	.post-description {
		margin: 1em 0;
		min-height: 3em;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	}

	.post-actions {
		margin-top: auto;
		padding-top: 1em;
	}

	.pagination-container {
		display: flex;
		justify-content: center;
		margin-top: 2em;
	}

	.pagination {
		display: flex;
		align-items: center;
		gap: 2em;
	}

	.page-info {
		min-width: 80px;
		text-align: center;
	}

	@media (max-width: 768px) {
		.content {
			margin-top: 40px;
		}

		.demo-cell {
			margin-top: 1em;
			margin-bottom: 1em;
		}

		.filter-section {
			flex-direction: column;
		}

		.filter-item {
			width: 100%;
		}
	}
</style>
