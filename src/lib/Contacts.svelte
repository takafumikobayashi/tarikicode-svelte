<script lang="ts">
    import Button, { Label } from '@smui/button';
    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Textfield from '@smui/textfield';
    import HelperText from '@smui/textfield/helper-text';
    import Checkbox from '@smui/checkbox';
    import FormField from '@smui/form-field';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import { onMount } from "svelte";
    import { writable } from "svelte/store";

    let valueA = '';
    let valueB = '';
    let valueC = '';
    let checked = false;
    let isButtonDisabled = writable(true);
    let open = false;

    // フォームの入力を監視し、ボタンの活性/非活性を切り替える関数
    function validateForm() {
        isButtonDisabled.set(!(valueA && valueB && valueC && checked));
    }

    // ボタンをクリックしたときにメールを送信する関数
    async function sendEmail() {
        const userAgent = navigator.userAgent;
        const emailContent = `
            件名: ${valueA}\n
            メールアドレス: ${valueB}\n
            内容: ${valueC}\n
            ユーザーエージェント: ${userAgent}
        `;

        try {
            const response = await fetch('https://your-email-api-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: 'takabumi.k@gmail.com',
                    subject: valueA,
                    body: emailContent,
                }),
            });

            if (response.ok) {
                alert('メールが送信されました。');
            } else {
                alert('メールの送信に失敗しました。');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            alert('メールの送信中にエラーが発生しました。');
        }
    }

    // 初期化
    onMount(() => {
        validateForm(); // 初回ロード時にボタンを無効化
    });
</script>

<LayoutGrid>
    <Cell span={12}>
        <!-- メールコンタクトフォーム -->
        <Cell span={12}>
            <div class="demo-cell">
                <Textfield
                style="width: 100%;"
                helperLine$style="width: 100%;"
                bind:value={valueA}
                label="お問合せ件名"
                required
                on:input={validateForm}
                >
                <HelperText slot="helper">お問合せに関する件名をご入力ください（必須）</HelperText>
                </Textfield>
            </div>
        </Cell>
        <Cell span={12}>
            <div class="demo-cell">
                <Textfield
                style="width: 100%;"
                input$autocomplete="email"
                helperLine$style="width: 100%;"
                bind:value={valueB}
                label="ご返信先メールアドレス"
                required
                on:input={validateForm}
                >
                <HelperText slot="helper">ご返信先となるメールアドレスをご入力ください（必須）</HelperText>
                </Textfield>
            </div>
        </Cell> 
        <Cell span={12}>
            <div class="demo-cell">
                <Textfield
                style="width: 100%;"
                helperLine$style="width: 100%;"
                textarea
                bind:value={valueC}
                label="お問合せ内容"
                required
                on:input={validateForm}
                >
                <HelperText slot="helper">お問合せの詳細についてご入力ください（必須）</HelperText>
                </Textfield>
            </div>
        </Cell>
        <Cell span={12}>
            <div class="demo-cell">
                <FormField>
                    <Checkbox bind:checked={checked} on:change={validateForm} />
                    <span slot="label">プライバシーポリシーに同意の上送信</span>
                </FormField>
            </div>
        </Cell>
        <Cell span={12}>
            <div class="demo-cell-right">
                <Button on:click={() => (open = true)} variant="raised" disabled={$isButtonDisabled}>
                    <Label>この内容で送信する</Label>
                </Button>
            </div>
        </Cell>
    </Cell>
</LayoutGrid>

<Dialog
    bind:open
    aria-labelledby="simple-title"
    aria-describedby="simple-content"
>
    <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
    <Title id="simple-title">お問合せの送信</Title>
    <Content id="simple-content">すみませんがまだ準備中のため送信することができません。</Content>
    <Actions>
        <Button on:click={sendEmail}>
        <Label>閉じる</Label>
        </Button>
    </Actions>
</Dialog>

<style>
    .demo-cell {
        margin-top: 2em;
        margin-bottom: 2em;
    }

    .demo-cell-right {
        margin-top: 2em;
        margin-bottom: 2em;
        display: flex;
        justify-content: flex-end;
    }
</style>