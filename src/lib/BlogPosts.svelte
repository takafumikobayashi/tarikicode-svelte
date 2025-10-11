<script lang="ts">
	import { onMount } from 'svelte';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Card, { Content, Media } from '@smui/card';
	import Button, { Label } from '@smui/button';
	import type { PostMetadata } from '$lib/utils/posts';

	let posts: PostMetadata[] = [];
	let loading = true;

	onMount(async () => {
		try {
			// サーバーから最新のブログ記事を取得
			const response = await fetch('/api/recent-blog-posts');
			const data = await response.json();
			posts = data.posts || [];
		} catch (error) {
			console.error('Failed to load blog posts:', error);
			posts = [];
		} finally {
			loading = false;
		}
	});

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

{#if loading}
	<LayoutGrid>
		<Cell span={12}>
			<div class="demo-cell">
				<p>記事を読み込み中...</p>
			</div>
		</Cell>
	</LayoutGrid>
{:else if posts.length > 0}
	<LayoutGrid>
		{#each posts as post}
			<Cell span={4}>
				<div class="demo-cell">
					<Card variant="outlined" class="blog-post-card">
						{#if post.image}
							<Media
								class="card-media"
								aspectRatio="16x9"
								style="background-image: url({post.image});"
							/>
						{/if}
						<Content>
							<h3 class="mdc-typography--headline6">{post.title}</h3>
							<div class="post-meta">
								<span class="mdc-typography--caption">{formatDate(post.date)}</span>
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
						</Content>
					</Card>
				</div>
			</Cell>
		{/each}

		<!-- もっと見るボタン -->
		<Cell span={12}>
			<div class="demo-cell more-button-container">
				<Button variant="raised" href="/blog">
					<Label>もっと見る</Label>
				</Button>
			</div>
		</Cell>
	</LayoutGrid>
{:else}
	<LayoutGrid>
		<Cell span={12}>
			<div class="demo-cell">
				<p class="mdc-typography--body1">記事はまだありません。</p>
			</div>
		</Cell>
	</LayoutGrid>
{/if}

<style>
	.demo-cell {
		width: 100%;
		margin-top: 1em;
		margin-bottom: 1em;
		display: flex;
		justify-content: center;
		align-items: stretch;
	}

	:global(.blog-post-card) {
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
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.post-actions {
		margin-top: auto;
		padding-top: 1em;
	}

	.more-button-container {
		justify-content: center;
		margin-top: 2em;
	}
</style>
