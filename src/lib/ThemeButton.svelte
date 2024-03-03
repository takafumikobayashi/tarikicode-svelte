<IconButton class='material-icons' on:click={() => switchTheme()}>
  {lightTheme ? 'dark_mode' : 'light_mode'}
</IconButton>

<script>
  import IconButton from '@smui/icon-button';

  let lightTheme = typeof window === 'undefined'
    || window.matchMedia ('(prefers-color-scheme: light)').matches;

  function switchTheme() {
    lightTheme = !lightTheme;
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
</script>
