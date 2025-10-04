<script>
	import Header from '$lib/Header.svelte';
	import Footer from '$lib/Footer.svelte';
	import Card from '$lib/Card.svelte';
	import HeroImage from '$lib/HeroImage.svelte';
	import Paper, { Title, Subtitle, Content } from '@smui/paper';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Sns from '$lib/Sns.svelte';
	import AboutMe from '$lib/AboutMe.svelte';
	import Articles from '$lib/Articles.svelte';
	import RecentPost from '$lib/RecentPost.svelte';
	import { AppConfig } from '$lib/AppConfig';
	import Contacts from '$lib/Contacts.svelte';
	import NewRelease from '$lib/NewRelease.svelte';
</script>

<svelte:head>
	<!-- Open Graph メタタグ -->
	<meta property="og:title" content="HOME" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={AppConfig.url} />
	<meta property="og:image" content={`${AppConfig.url}/logo-192.png`} />
	<meta property="og:description" content={AppConfig.description} />
	<meta property="og:site_name" content={AppConfig.title} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={AppConfig.xaccuont} />
	<meta name="twitter:title" content={AppConfig.title} />
	<meta name="twitter:description" content={AppConfig.description} />
	<meta name="twitter:image" content={`${AppConfig.url}/logo-192.png`} />
</svelte:head>

<div class="mdc-typography--body1">
	<div class="content fade-in">
		<Header />
		<HeroImage />
		<LayoutGrid>
			<Cell span={12}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Title>AboutMe</Title>
							<Subtitle>私について</Subtitle>
							<Content>
								<AboutMe linkon={true} />
							</Content>
						</Paper>
					</div>
				</div>
			</Cell>

			<Cell span={12}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Title>New Release</Title>
							<Subtitle>新着情報</Subtitle>
							<Content>
								<NewRelease />
							</Content>
						</Paper>
					</div>
				</div>
			</Cell>

			<Cell span={12}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Title>Works</Title>
							<Subtitle>お仕事について</Subtitle>
							<Content>
								<Card />
							</Content>
						</Paper>
					</div>
				</div>
			</Cell>

			<Cell span={12}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Title>Pickup Articles</Title>
							<Subtitle>ピックアップ記事</Subtitle>
							<Content>
								<Articles />
							</Content>
						</Paper>
					</div>
				</div>
			</Cell>

			<Cell span={12}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Title>RecentPost</Title>
							<Subtitle>最近の投稿</Subtitle>
							<Content>
								<RecentPost />
							</Content>
						</Paper>
					</div>
				</div>
			</Cell>
			<Cell span={6}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Title>Contacts</Title>
							<Subtitle
								>お仕事、講演、その他お問合せ等ございましたら下記よりご連絡ください。</Subtitle
							>
							<Content>
								<center><Contacts /></center>
							</Content>
						</Paper>
					</div>
				</div>
			</Cell>
			<Cell span={6}>
				<div class="demo-cell">
					<div class="paper-container">
						<Paper variant="unelevated">
							<Content>
								<center><Sns /></center>
							</Content>
						</Paper>
					</div>
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

		.paper-container {
			padding: 1em; /* モバイルでのパディングを調整 */
		}
	}
</style>
