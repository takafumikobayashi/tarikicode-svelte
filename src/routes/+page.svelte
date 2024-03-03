<svelte:head>
  <title>SvelteKit Material UI</title>
</svelte:head>

<div class="mdc-typography--body1">

<Header />
<HeroImage />

<div class="content">

  <LayoutGrid>
    <Cell span={12}>
        <div class="demo-cell">
          <div class="paper-container">
            <Paper variant="unelevated">
              <Title>AboutMe</Title>
              <Subtitle>This is an unelevated sheet of paper.</Subtitle>
              <Content>
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
            <Subtitle>This is an unelevated sheet of paper.</Subtitle>
            <Content>
              <Card />
            </Content>
          </Paper>
        </div>
      </div>
    </Cell>

    <Cell span={6}>
      <div class="demo-cell">
        <div class="paper-container">
          <Paper variant="unelevated">
            <Title>Recent Articles</Title>
            <Subtitle>This is an unelevated sheet of paper.</Subtitle>
            <Content>
              <center>
              <iframe class="speakerdeck-iframe" frameborder="0" src="https://speakerdeck.com/player/59662588fd324da6bceb344db49a6e50" title="2024.1.20気ままに勉強会#75" allowfullscreen="true" style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 50%; height: auto; aspect-ratio: 560 / 315;" data-ratio="1.7777777777777777"></iframe>
              <iframe class="note-embed" src="https://note.com/embed/notes/n16a999fe3b1e" style="border: 0; display: block; max-width: 99%; width: 494px; padding: 0px; margin: 10px 0px; position: static; visibility: visible;" height="400"></iframe><script async src="https://note.com/scripts/embed.js" charset="utf-8"></script>
              </center>
            </Content>
          </Paper>
        </div>
      </div>
    </Cell>

    <Cell span={6}>
      <div class="demo-cell">
        <div class="paper-container">
          <Paper variant="unelevated">
            <Title>RecentPost</Title>
            <Subtitle>This is an unelevated sheet of paper.</Subtitle>
            <Content>
              <center>
              <blockquote class="twitter-tweet"><p lang="ja" dir="ltr">お友達の理事の方からのご紹介でコミュニティ参加申し込んでみましたー <a href="https://t.co/fZfiGtO9g0">https://t.co/fZfiGtO9g0</a></p>&mdash; 他力code | kobatch.eth (@kobatch_tk) <a href="https://twitter.com/kobatch_tk/status/1763732648479047747?ref_src=twsrc%5Etfw">March 2, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
              </center>
            </Content>
          </Paper>
        </div>
      </div>
    </Cell>

    <Cell span={12}>
      <div class="demo-cell">
        <div class="paper-container">
          <Paper variant="unelevated">
            <Title>MySNS</Title>
            <Subtitle>This is an unelevated sheet of paper.</Subtitle>
            <Content>
              <center><Sns /></center>
            </Content>
          </Paper>
        </div>
      </div>
    </Cell>
  </LayoutGrid>

</div>

<Footer />

</div>

<script>
  import Header from '../lib/Header.svelte';
  import Footer from '$lib/Footer.svelte';
  import Card from '$lib/Card.svelte';
  import HeroImage from '$lib/HeroImage .svelte';
  import Paper, { Title, Subtitle, Content } from '@smui/paper';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import Sns from '$lib/Sns.svelte';
</script>

<style>
  .content {
    margin-top: 60px; /* ヘッダーの高さに応じて調整 */
  }

  .demo-cell {
    width: 100%;
    margin-top: 5em;
    margin-bottom: 5em;
    justify-content: center;
    align-items: center;
  }
</style>