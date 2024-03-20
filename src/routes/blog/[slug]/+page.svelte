<script lang="ts">
    import { onMount } from 'svelte';
    import Header from '$lib/Header.svelte';
    import Footer from '$lib/Footer.svelte';
    import ContentImage from '$lib/ContentImage.svelte';
    import { page } from '$app/stores';
    import { onDestroy } from 'svelte';

    // ハイライトのスタイルを読み込む
    import hljs from 'highlight.js';
    import 'highlight.js/styles/atom-one-dark.css'; // お好みのスタイルを選択
    export let data;

    onMount(() => {
        // コンテンツがDOMにレンダリングされた後にハイライトを適用
        document.querySelectorAll('pre code').forEach((block) => {
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