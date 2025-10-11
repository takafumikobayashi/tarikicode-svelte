<script>
	import Header from '../../lib/Header.svelte';
	import ContentImage from '$lib/ContentImage.svelte';
	import Footer from '../../lib/Footer.svelte';
	import Tab, { Icon, Label } from '@smui/tab';
	import TabBar from '@smui/tab-bar';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Paper, { Content } from '@smui/paper';
	import AboutMe from '../../lib/AboutMe.svelte';
	import Works from '$lib/Works.svelte';
	import Favorites from '$lib/Favorites.svelte';
	import Profile from '$lib/Profile.svelte';
	import Projects from '$lib/Projects.svelte';
	import { AppConfig } from '$lib/AppConfig';

	let tabs = [
		{
			icon: 'face',
			label: 'Profile'
		},
		{
			icon: 'code',
			label: 'Projects'
		},
		{
			icon: 'computer',
			label: 'Works'
		},
		{
			icon: 'dining',
			label: 'Favorites'
		}
	];
	let active = tabs[0];
</script>

<svelte:head>
	<!-- Open Graph メタタグ -->
	<meta property="og:title" content={`ABOUT - ${AppConfig.title}`} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${AppConfig.url}/about`} />
	<meta property="og:image" content={AppConfig.post_string.about} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:description" content={AppConfig.description} />
	<meta property="og:site_name" content={AppConfig.title} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={AppConfig.xaccuont} />
	<meta name="twitter:title" content={AppConfig.title} />
	<meta name="twitter:description" content={AppConfig.description} />
	<meta name="twitter:image" content={AppConfig.post_string.about} />
</svelte:head>

<div class="mdc-typography--body1">
	<div class="content fade-in">
		<Header />
		<ContentImage post_string="about" />
		<div class="mdc-typography--body1">
			<p>このサイトにお越しいただき、ありがとうございます。</p>
		</div>
		<LayoutGrid>
			<Cell span={12}>
				<div class="demo-cell">
					<AboutMe linkon={false} />
				</div></Cell
			>

			<Cell span={12}>
				<div class="demo-cell">
					<TabBar {tabs} let:tab bind:active>
						<Tab {tab}>
							<Icon class="material-icons">{tab.icon}</Icon>
							<Label>{tab.label}</Label>
						</Tab>
					</TabBar>

					{#if active.label === 'Profile'}
						<Paper variant="unelevated">
							<Content>
								<Profile />
							</Content>
						</Paper>
					{:else if active.label === 'Projects'}
						<Paper variant="unelevated">
							<Content>
								<Projects />
							</Content>
						</Paper>
					{:else if active.label === 'Works'}
						<Paper variant="unelevated">
							<Content>
								<Works />
							</Content>
						</Paper>
					{:else if active.label === 'Favorites'}
						<Paper variant="unelevated">
							<Content>
								<Favorites />
							</Content>
						</Paper>
					{/if}
				</div>
			</Cell>
		</LayoutGrid>
		<Footer />
	</div>
</div>

<style>
	.demo-cell {
		width: 100%;
		margin-top: 2em;
		margin-bottom: 2em;
		justify-content: center;
		align-items: center;
	}

	/* モバイル端末向けのスタイル */
	@media (max-width: 768px) {
		.content {
			margin-top: 40px; /* モバイルでのマージンを減らす */
		}

		.demo-cell {
			margin-top: 1em; /* モバイルでのマージンを減らす */
			margin-bottom: 1em;
		}

		:global(.paper-container) {
			padding: 1em; /* モバイルでのパディングを調整 */
		}
	}
</style>
