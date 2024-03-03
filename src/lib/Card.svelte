<script>
    import Card, {
        Content,
        PrimaryAction,
        Media,
        MediaContent,
    } from '@smui/card';
    let clicked = 0;
</script>

<div class="card-display">
    <div class="card-container">
        <Card>
            <div style="padding: 1rem;">
            <h2 class="mdc-typography--headline6" style="margin: 0;">
                A card with media.
            </h2>
            <h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
                And a subtitle.
            </h3>
            </div>
            <PrimaryAction on:click={() => clicked++}>
            <Media class="card-media-16x9" aspectRatio="16x9" />
            <Content class="mdc-typography--body2">
                And some info text. And the media and info text are a primary action
                for the card.
            </Content>
            </PrimaryAction>
        </Card>
    </div>

    <div class="card-container">
        <Card>
            <div style="padding: 1rem;">
            <h2 class="mdc-typography--headline6" style="margin: 0;">
                A card with media.
            </h2>
            <h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
                And a subtitle.
            </h3>
            </div>
            <PrimaryAction on:click={() => clicked++}>
            <Media class="card-media-16x9" aspectRatio="16x9" />
            <Content class="mdc-typography--body2">
                And some info text. And the media and info text are a primary action
                for the card.
            </Content>
            </PrimaryAction>
        </Card>
    </div>

    <div class="card-container">
        <Card>
            <div style="padding: 1rem;">
            <h2 class="mdc-typography--headline6" style="margin: 0;">
                A card with media.
            </h2>
            <h3 class="mdc-typography--subtitle2" style="margin: 0; color: #888;">
                And a subtitle.
            </h3>
            </div>
            <PrimaryAction on:click={() => clicked++}>
            <Media class="card-media-16x9" aspectRatio="16x9" />
            <Content class="mdc-typography--body2">
                And some info text. And the media and info text are a primary action
                for the card.
            </Content>
            </PrimaryAction>
        </Card>
    </div>
</div>

<style>
    .card-display {
        display: flex;
        flex-wrap: wrap;
        justify-content: center; /* カードを中央揃えにしたい場合 */
        gap: 30px; /* カード間のスペース */
    }

    .card-container {
        flex: 1; /* 各カードがフレキシブルに空間を埋めるように */
        min-width: 280px; /* カードの最小幅 */
        max-width: 380px; /* カードの最大幅 */
        background-color: var(--mdc-theme-background, #f8f8f8);
        border: 1px solid var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1));
        padding: 20px;
    }
    
    :global(.card-media-16x9) {
        background-image: url(https://placehold.co/320x180?text=16x9);
        height: 180px;
    }

    :global(.card-media-square) {
        background-image: url(https://placehold.co/320x320?text=square);
    }

    @media (max-width: 480px) {
        :global(.card-container) {
            margin-right: 0;
            padding-right: 0;
            padding-left: 0;
        }
    }   
</style>