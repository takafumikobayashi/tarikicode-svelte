<script>
  let imageUrl = 'https://source.unsplash.com/random?code&javascript';
  let heroTitle = "Your Hero Title Here";
</script>

<div class="hero" style="background-image: url({imageUrl});">
  <div class="hero-title">{heroTitle}</div>
</div>

<style>
  .hero {
    margin-top: 60px; /* ヘッダーの高さに応じて調整 */
    align-items: center;
    position: relative;
    width: 100%;
    height: 30vh; /* ビューポートの高さに基づいた高さ */
    background-size: cover; /* 画像をカバーとして表示 */
    background-position: center; /* 中央に配置 */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-title {
    font-size: 2em; /* 必要に応じて調整 */
    text-align: center;
    padding: 10px;
  }
</style>

  