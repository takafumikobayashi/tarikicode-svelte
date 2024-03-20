<IconButton class='material-icons' on:click={() => switchTheme()}>
  {lightTheme ? 'dark_mode' : 'light_mode'}
</IconButton>

<script>
  import { onMount } from 'svelte';
  import IconButton from '@smui/icon-button';

  let lightTheme = typeof window === 'undefined'
    || window.matchMedia ('(prefers-color-scheme: light)').matches;

  onMount(() => {
    // ローカルストレージからテーマ設定を読み込む
    lightTheme = localStorage.getItem('lightTheme') === 'true'
      || (localStorage.getItem('lightTheme') === null
          && window.matchMedia('(prefers-color-scheme: light)').matches);
    updateTheme();
  });
  
  function switchTheme() {
    lightTheme = !lightTheme;
    localStorage.setItem('lightTheme', lightTheme.toString()); // ローカルストレージに保存
    let themeLink = document.head.querySelector('#theme');

    if (!themeLink) {
      themeLink = document.createElement('link');
      // @ts-ignore
      themeLink.rel = 'stylesheet';
      themeLink.id = 'theme';
    }

    // @ts-ignore
    themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;

    // @ts-ignore
    document.head
      .querySelector('link[href="/smui-dark.css"]')
      .insertAdjacentElement('afterend', themeLink);
  }

  function updateTheme() {
    let themeLink = document.head.querySelector('#theme');

    if (!themeLink) {
      themeLink = document.createElement('link');
      // @ts-ignore
      themeLink.rel = 'stylesheet';
      themeLink.id = 'theme';
      document.head.append(themeLink);
    }

    // @ts-ignore
    themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;
  }
</script>
