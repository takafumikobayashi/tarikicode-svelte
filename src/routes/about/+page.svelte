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

    let tabs = [
        {
            icon: 'face',
            label: 'Profile',
        },
        {
            icon: 'computer',
            label: 'Works',
        },
        {
            icon: 'dining',
            label: 'Favorites',
        },
    ];
    let active = tabs[0];
</script>

<svelte:head>
    <title>tariki-code</title>
    <!-- Open Graph メタタグ -->
	<meta property="og:title" content="ABOUT" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://tariki-code.tokyo/about" />
	<meta property="og:image" content="https://tariki-code.tokyo/imgs/heroimage1.png" />
	<meta property="og:description" content="一緒に創る、明日のためのcode" />
	<meta property="og:site_name" content="他力code(tariki-code)" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@kobatch_tk" />
    <meta name="twitter:title" content="他力code(tariki-code)" />
    <meta name="twitter:description" content="一緒に創る、明日のためのcode" />
    <meta name="twitter:image" content="https://tariki-code.tokyo/imgs/heroimage1.png" />
</svelte:head>

<div class="mdc-typography--body1">
    <div class="content fade-in">
        <Header />
        <ContentImage post_string="about"/>
        <div class="mdc-typography--body1"><p>このサイトにお越しいただき、ありがとうございます。</p></div>
        <LayoutGrid>
            <Cell span={12}>
                <div class="demo-cell">
                    <AboutMe linkon={false}/>
            </Cell>

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

        .paper-container {
            padding: 1em; /* モバイルでのパディングを調整 */
        }
    }
</style>