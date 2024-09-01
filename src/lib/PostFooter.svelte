<style>
  .post-footer {
        margin-top: 100px;
        text-align: center;
        position: static;
        bottom: 0;
        left: 0; /* ビューポートの左端から */
        right: 0; /* ビューポートの右端まで */
        width: 100%;
        box-sizing: border-box; /* パディングを含めて幅を計算 */
    }

  .flexy {
    display: flex;
    justify-content: center; /* 水平方向に中央寄せ */
    align-items: center;     /* 垂直方向に中央寄せ */
  }

  .margins {
    margin: 10px; /* 必要に応じてマージンを調整 */
  }

  .centered-fab {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center; /* テキストを中央揃え */
    width: 100%;        /* ボタンを中央に配置するために幅を100%に設定 */
  }
</style>

<script lang="ts">
  import Fab, { Label, Icon } from '@smui/fab';
  import LayoutGrid, { Cell } from '@smui/layout-grid';
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { AppConfig } from './AppConfig';

  let likes = writable(0);
  let pageUrl = "";

  onMount(async () => {
    // サーバーから現在の「いいね」数を取得する
    try {
      pageUrl = window.location.pathname.split('/').filter(Boolean).pop();
      const response = await fetch(`${AppConfig.likeserverurl}?${encodeURIComponent(pageUrl)}`);
      const data = await response.json();
      if (data && data.last_updated !== null) {
        likes.set(data.likes);
      } else {
        // データがなければ新規に初期値を設定
        await addNewPageLikes();
        likes.set(0);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  });

  async function addNewPageLikes() {
    try {
      // 新規ページの「いいね」数を0で初期化
      await fetch(AppConfig.likeserverurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "initialize",
          url: pageUrl
        }),
      });
    } catch (error) {
      console.error("Error adding new page likes:", error);
    }
  }

  async function incrementLikes() {
    // 現在の「いいね」数を取得してインクリメント
    const newLikes = $likes + 1;

    // サーバーに更新をリクエスト
    try {
      await fetch(AppConfig.likeserverurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "update",
          url: pageUrl,
          likes: newLikes,
        }),
      });
      likes.set(newLikes);  // クリック後に新しい値をセット
    } catch (error) {
      console.error("Error incrementing likes:", error);
    }
  }
</script>

<div class="mdc-typography--body1 post-footer">
  <div class="content fade-in">
    <Cell span={12}>
      <div class="flexy">
        <div class="margins">
          <Fab color="primary" on:click={incrementLikes} extended class="centered-fab">
            <Icon class="material-icons" on>favorite</Icon>
            <Label>Likes: {$likes}</Label>
          </Fab>
        </div>
      </div>
    </Cell>
  </div>
</div>

