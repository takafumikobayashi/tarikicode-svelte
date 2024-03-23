<script lang="ts">
    import { onMount } from 'svelte';
    import Header from '$lib/Header.svelte';
    import Footer from '$lib/Footer.svelte';
    import ContentImage from '$lib/ContentImage.svelte';
    import { page } from '$app/stores';
    import { onDestroy } from 'svelte';
    import { AppConfig } from '$lib/AppConfig';

    // ハイライトのスタイルを読み込む
    import hljs from 'highlight.js';
    import 'highlight.js/styles/atom-one-dark.css'; // お好みのスタイルを選択
    export let data;

    onMount(() => {
        // コンテンツがDOMにレンダリングされた後にハイライトを適用
        document.querySelectorAll('pre code').forEach((block) => {
            //@ts-ignore
            hljs.highlightBlock(block);
        });
    });

    // slugを取得
    let post_string: string;
    // page ストアを購読して slug パラメータを取得
    const unsubscribe = page.subscribe($page => {
        post_string = $page.params.slug;
    });

    // コンポーネントが破棄されたときに購読を解除
    onDestroy(unsubscribe);

</script>

<svelte:head>
    <title>tariki-code</title>
    <!-- Open Graph メタタグ -->
	<meta property="og:title" content={`${post_string} - 他力code(tariki-code)`} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`https://tariki-code.tokyo/blog/${post_string}`} />
	<meta property="og:image" content={`https://tariki-code.tokyo/${AppConfig.post_string[post_string]}`} />
	<meta property="og:description" content="一緒に創る、明日のためのcode" />
	<meta property="og:site_name" content="他力code(tariki-code)" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@kobatch_tk" />
    <meta name="twitter:title" content="他力code(tariki-code)" />
    <meta name="twitter:description" content="一緒に創る、明日のためのcode" />
    <meta name="twitter:image" content={`https://tariki-code.tokyo/${AppConfig.post_string[post_string]}`} />
</svelte:head>

<div class="mdc-typography--body1">
    <div class="content fade-in">
        <Header />
        <ContentImage post_string={post_string}/>
        <article>
            {@html data.body}
        </article>
        <Footer />
    </div>
</div>