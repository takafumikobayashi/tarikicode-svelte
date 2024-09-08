<script lang="ts">
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import { AppConfig } from './AppConfig';
    import Button, { Label } from '@smui/button';
    import { aboutLink } from './CommonFunction';
    
    // @ts-ignore
    export let linkon;
</script>

<LayoutGrid>
    <Cell span={6}>
        <div class="demo-cell">
            <div class="profile-image">
                <img src="/icon/1681593350707.jpeg" alt="プロフィール画像">
            </div>
        </div>
    </Cell>
    <Cell span={6}>
        <div class="demo-cell-left">
            <div class="mdc-typography--headline5">
                <p>{AppConfig.author}</p>
            </div>
            <div class="mdc-typography--body1">
                他力code代表<br>
                ITストラテジスト / プロジェクトマネージャー<br>
                経済産業省 大臣官房デジタルトランスフォーメーション室<br>
                Social Technology Officer（北海道のNPO事業とデジタル化伴走支援）<br>
                客員講師（地方国立高専）<br>
                Microsoft, Node.js関連等、技術コミュニティでの発信活動<br>
                SNS発信活動（京都・奈良などの日本美 / 地域情報発信）
            </div>
            {#if linkon}
                <div class="demo-cell-left">
                    <Button on:click={() => aboutLink()} variant="raised">
                        <Label>プロフィールをもっと見る</Label>
                    </Button>
                </div>
            {/if}
        </div>
    </Cell>
</LayoutGrid>

<style>
    .profile-image img {
        /* 画像のサイズを設定 */
        width: 300px; /* 例: 100px */
        height: 300px; /* 画像を正方形にするため、幅と同じ値に設定 */
        
        /* 画像を丸く表示 */
        border-radius: 50%;
        
        /* 画像の枠線（オプション） */
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 軽い影を追加 */
    }

    .demo-cell {
        width: 100%; 
        margin-top: 2em;
        margin-bottom: 2em;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%; /* セルの高さを設定（必要に応じて調整） */
    }

    .demo-cell-left {
        width: 100%; 
        margin-top: 2em;
        margin-bottom: 2em;
        display: flex;
        flex-direction: column; /* コンテンツを縦方向に並べる */
        justify-content: center;
        align-items: flex-start; /* 左寄せでセンタリング */
        height: 100%; /* セルの高さを設定（必要に応じて調整） */
    }
</style>

