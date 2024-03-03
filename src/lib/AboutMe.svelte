<script lang="ts">
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import { AppConfig } from './AppConfig';
</script>

<LayoutGrid>
    <Cell span={6}>
        <div class="demo-cell">
            <div class="profile-image">
                <img src="/icon/icon-512x512.png" alt="プロフィール画像">
            </div>
        </div>
    </Cell>
    <Cell span={6}>
        <div class="demo-cell-left">
            <div class="mdc-typography--headline4">
                <p>{AppConfig.author}</p>
            </div>
            <div class="mdc-typography--body1">
                「他力code」の屋号でDXやITコミュニティに関する活動をしております。<br>
                経済産業省にて行政DXのサポート、およびNPO法人の事業とデジタル化推進の伴走支援をしております。<br>
                以前は暗号資産業界にてプロジェクトマネージャーをしておりました。<br>
                さらにその前は大手通信業（携帯電話会社）でエンジニアリングマネージャーをしておりました。<br>
            </div>
            <p><a href=/about>プロフィールをもっと見る</a></p>
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
    }

    .demo-cell-left {
        width: 100%; 
        margin-top: 2em;
        margin-bottom: 2em;
        justify-content: left;
        align-items: center;
    }
</style>

