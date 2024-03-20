<script>
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { AppConfig } from './AppConfig';

  import { onMount } from 'svelte';
  import Swiper from 'swiper';
  import { Navigation, Pagination, Autoplay } from 'swiper/modules';
  import 'swiper/css';
  import 'swiper/css/navigation';
  import 'swiper/css/pagination'; 

  let swiper;

  onMount(() => {
    swiper = new Swiper('.swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      speed: 1000,
      autoplay: {
        delay: 5000, // 5秒ごとに自動遷移
        disableOnInteraction: false, // ユーザーの操作後も自動遷移を続ける
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
    });
  });
</script>

<div class="fade-in">

  <div class="swiper-container">
    <div class="swiper-wrapper">
      <!-- 各スライドの内容 -->
      <div class="swiper-slide">
        <LayoutGrid>
          <Cell align="middle" span={6}>
            <div class="mdc-typography--headline5 hero-title">{AppConfig.heroimage[0].descpiption}</div>
            <div class="mdc-typography--body1">
              <p>{AppConfig.heroimage[0].details}</p>
            </div>
          </Cell>
          <Cell align="middle" span={6}> 
            <div class="hero" style="background-image: url({AppConfig.heroimage[0].image});" />
          </Cell>
        </LayoutGrid>
      </div>
      <div class="swiper-slide">
        <LayoutGrid>
          <Cell align="middle" span={6}>
            <div class="mdc-typography--headline5 hero-title">{AppConfig.heroimage[1].descpiption}</div>
            <div class="mdc-typography--body1">
              <p>{AppConfig.heroimage[1].details}</p>
            </div>
          </Cell>
          <Cell align="middle" span={6}> 
            <div class="hero" style="background-image: url({AppConfig.heroimage[1].image});" />
          </Cell>
        </LayoutGrid>
      </div>
      <div class="swiper-slide">
        <LayoutGrid>
          <Cell align="middle" span={6}>
            <div class="mdc-typography--headline5 hero-title">{AppConfig.heroimage[2].descpiption}</div>
            <div class="mdc-typography--body1">
              <p>{AppConfig.heroimage[2].details}</p>
            </div>
          </Cell>
          <Cell align="middle" span={6}> 
            <div class="hero" style="background-image: url({AppConfig.heroimage[2].image});" />
          </Cell>
        </LayoutGrid>
      </div>
    </div>
    <!-- ページネーション -->
    <div class="swiper-pagination"></div>
  </div>

</div>


<style>
  .hero {
    margin-top: 60px; /* ヘッダーの高さに応じて調整 */
    align-items: center;
    position: relative;
    width: 100%;
    height: 40vh; /* ビューポートの高さに基づいた高さ */
    background-size: cover; /* 画像をカバーとして表示 */
    background-position: center; /* 中央に配置 */
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 20px; /* 角を丸くする */
  }

  .hero-title {
    text-align: center;
    padding: 10px;
  }

  .swiper-container {
    width: 100%;
    height: 60vh; /* ビューポートの高さに基づいた高さ */
    position: relative;
    border-radius: 20px; /* 角を丸くする */
    overflow: hidden; /* コンテナの外側のコンテンツを隠す */
  }

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px; /* 適切なサイズに調整 */
  }

  /* ページネーション（省略可能） */
  .swiper-pagination {
    bottom: 10px; /* 下側に配置 */
    left: 0;
    width: 100%;
    text-align: center;
  }

  .swiper-pagination-bullet {
    background-color: var(--mdc-theme-secondary, #333);
    opacity: 0.7;
  }

  .swiper-pagination-bullet-active {
    background-color: var(--mdc-theme-primary, #333);
    opacity: 1;
  }

  @media (max-width: 280px) {
    .swiper-container {
      height: 140vh; /* モバイルではコンテナの高さを調整 */
    }
  }

  @media (min-width: 281px) and (max-width: 375px) {
    .swiper-container {
      height: 120vh; /* モバイルではコンテナの高さを調整 */
    }
  }

  @media (min-width: 376px) and (max-width: 390px) {
    .swiper-container {
      height: 100vh; /* モバイルではコンテナの高さを調整 */
    }
    .swiper-pagination {
      bottom: 2px; /* PCでは位置を調整 */
    }
  }

  @media (min-width: 391px) and (max-width: 400px) {
    .swiper-container {
      height: 90vh; /* モバイルではコンテナの高さを調整 */
    }
  }

  @media (min-width: 401px) and (max-width: 414px) {
    .swiper-container {
      height: 95vh; /* モバイルではコンテナの高さを調整 */
    }
  }

  @media (min-width: 415px) and (max-width: 430px) {
    .swiper-container {
      height: 90vh; /* モバイルではコンテナの高さを調整 */
    }
  }

  @media (min-width: 431px) and (max-width: 768px) {
    .swiper-container {
      height: 90vh; /* モバイルではコンテナの高さを調整 */
    }
  }

  @media (min-width: 769px) and (max-width: 820px) {
    .swiper-container {
      height: 75vh; /* モバイルではコンテナの高さを調整 */
    }
  }
</style>