<script lang="ts">
    import Button, { Label } from '@smui/button';
    import ThemeButton from '$lib/ThemeButton.svelte';
    import Menu from '@smui/menu';
    import List, { Item, Text } from '@smui/list';

    let menu: Menu;
    let clicked = 'nothing yet';

    function handleClick() {
        window.location.href = 'https://tariki-coe.tokyo'; // リンク先に遷移
    }
</script>

<style>
    .nav-item {
        margin-left: 20px;
        display: flex; /* Flexboxコンテナに設定 */
        align-items: center; /* 子要素を中央揃えに */
    }

    .nav-container {
        display: flex;
        align-items: center;
    }
</style>

<div class="main-header">
    <div class="mdc-typography--headline5"><strong>他力code</strong></div>
    <div class="nav-container">
        <div class="nav-item">
            <Button color="primary" on:click={handleClick}>
                <Label>Home</Label>
            </Button>
            <Button color="secondary" on:click={handleClick}>
                <Label>About</Label>
            </Button>
            <Button color="secondary" on:click={handleClick}>
                <Label>Service</Label>
            </Button>
            <div style="min-width: 100px;">
                <Button color="secondary" on:click={() => menu.setOpen(true)}>
                    <Label>Contact</Label>
                </Button>
                <Menu bind:this={menu}>
                    <List>
                        <Item on:SMUI:action={() => (clicked = 'Cut')}>
                            <Text>Mail</Text>
                        </Item>
                        <Item on:SMUI:action={() => (clicked = 'Copy')}>
                            <Text>X</Text>
                        </Item>
                        <Item on:SMUI:action={() => (clicked = 'Paste')}>
                            <Text>LinkedIn</Text>
                        </Item>
                        <Item on:SMUI:action={() => (clicked = 'Delete')}>
                            <Text>Facebook</Text>
                        </Item>
                    </List>
                </Menu>
            </div>
            <ThemeButton />
        </div>
    </div>
</div>
