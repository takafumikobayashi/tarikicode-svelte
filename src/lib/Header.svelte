<script lang="ts">
    import Button, { Label } from '@smui/button';
    import ThemeButton from '$lib/ThemeButton.svelte';
    import Menu from '@smui/menu';
    import List, { Item, Text } from '@smui/list';
    import { homeLink, mailLink, twitterLink, githubLink, linkedinLink, facebookLink, aboutLink } from './CommonFunction';

    let menu: Menu;
    
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
            <Button color="primary" on:click={homeLink}>
                <Label>Home</Label>
            </Button>
            <Button color="secondary" on:click={aboutLink}>
                <Label>About</Label>
            </Button>
            <div style="min-width: 100px;">
                <Button color="secondary" on:click={() => menu.setOpen(true)}>
                    <Label>Contact</Label>
                </Button>
                <Menu bind:this={menu}>
                    <List>
                        <Item on:SMUI:action={() => mailLink()}>
                            <Text>Mail</Text>
                        </Item>
                        <Item on:SMUI:action={() => twitterLink()}>
                            <Text>X</Text>
                        </Item>
                        <Item on:SMUI:action={() => githubLink()}>
                            <Text>Github</Text>
                        </Item>
                        <Item on:SMUI:action={() => linkedinLink()}>
                            <Text>LinkedIn</Text>
                        </Item>
                        <Item on:SMUI:action={() => facebookLink()}>
                            <Text>Facebook</Text>
                        </Item>
                    </List>
                </Menu>
            </div>
            <ThemeButton />
        </div>
    </div>
</div>