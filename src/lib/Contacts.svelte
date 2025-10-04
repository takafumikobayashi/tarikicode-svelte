<script lang="ts">
	import Button, { Label } from '@smui/button';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import Checkbox from '@smui/checkbox';
	import FormField from '@smui/form-field';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import { onMount } from 'svelte';
	import { writable, get } from 'svelte/store';

	function getGrecaptcha(): any {
		if (typeof window === 'undefined') {
			return undefined;
		}
		const globalWindow = window as typeof window & { grecaptcha?: any };
		return globalWindow.grecaptcha;
	}
	let valueA = '';
	let valueB = '';
	let valueC = '';
	let checked = false;
	let isButtonDisabled = writable(true);
	let open = false;
	let openDialog = writable(false); // 送信後のダイアログを開く状態管理
	let dialogTitle = writable(''); // ダイアログのメッセージ
	let dialogMessage = writable(''); // ダイアログのメッセージ
	let recaptchaReady = writable(false);
	let honeyfield = ''; // Honeypotフィールド用の変数
	let formLoadTime: number; // フォームが表示された時刻（ミリ秒）

	// フォームの入力を監視し、ボタンの活性/非活性を切り替える関数
	function validateForm() {
		// Honeypotフィールドが空で、他の必須フィールドが入力されているかをチェック
		const ready = get(recaptchaReady);
		isButtonDisabled.set(!(valueA && valueB && valueC && checked && !honeyfield && ready));
	}

	// フォームの値をリセットする関数
	function resetForm() {
		valueA = '';
		valueB = '';
		valueC = '';
		checked = false;
		validateForm(); // ボタンを再度無効化
		formLoadTime = Date.now(); // フォームが表示されたタイミングでタイムスタンプを取得
	}

	// ボタンをクリックしたときにメールを送信する関数
	async function sendEmail() {
		const currentTime = Date.now();
		const elapsedTime = currentTime - formLoadTime; // 経過時間を計算

		// ここでは30秒未満の場合にスパムと判断
		if (elapsedTime < 30000) {
			dialogTitle.set('送信に失敗しました。');
			dialogMessage.set('再度お試しください。');
			openDialog.set(true);
			resetForm();
			formLoadTime = Date.now(); // フォームが表示されたタイミングでタイムスタンプを取得
			return;
		}

		// Honeypotフィールドが入力されていれば、スパムと判断し送信を中止
		if (honeyfield) {
			dialogTitle.set('送信に失敗しました。');
			dialogMessage.set('再度お試しください。');
			openDialog.set(true);
			resetForm();
			return;
		}

		// reCAPTCHAのトークンを取得
		const grecaptchaInstance = getGrecaptcha();
		if (!grecaptchaInstance) {
			dialogTitle.set('送信に失敗しました。');
			dialogMessage.set(
				'reCAPTCHAの準備が整っていません。ページを再読み込みしてお試しください。'
			);
			openDialog.set(true);
			return;
		}

		const recaptchaToken = await new Promise<string>((resolve, reject) => {
			grecaptchaInstance.ready(() => {
				grecaptchaInstance
					.execute(import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY, { action: 'submit' })
					.then((token) => {
						resolve(token);
					})
					.catch((error) => {
						reject(error);
					});
			});
		});

		if (!recaptchaToken) {
			alert('reCAPTCHAの検証に失敗しました。');
			return;
		}

		const userAgent = navigator.userAgent;
		const emailContent = `
            ${valueC}\n\n${userAgent}
        `;

		try {
			const response = await fetch(import.meta.env.VITE_LAMBDA_SERVER_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					type: 'sendEmail',
					subject: valueA,
					email: valueB,
					content: emailContent,
					token: recaptchaToken
				})
			});

			if (response.ok) {
				dialogTitle.set('送信されました。');
				dialogMessage.set(
					'お問合せありがとうございました。連絡があるまで今しばらくお待ちください。'
				);
				resetForm(); // フォームをリセット
				// window.location.reload(); // ページをリロードしたい場合
			} else {
				dialogTitle.set('送信に失敗しました。');
				dialogMessage.set('お手数ですがしばらく待ってから再度お試しください。');
			}
		} catch (error) {
			console.error('Error sending email:', error);
			dialogTitle.set('送信に失敗しました。');
			dialogMessage.set('お手数ですがしばらく待ってから再度お試しください。');
		}

		openDialog.set(true); // ダイアログを開く
	}

	// 初期化
	onMount(() => {
		formLoadTime = Date.now(); // フォームが表示されたタイミングでタイムスタンプを取得
		validateForm(); // 初回ロード時にボタンを無効化

		const waitForRecaptcha = setInterval(() => {
			const grecaptchaInstance = getGrecaptcha();
			if (grecaptchaInstance) {
				grecaptchaInstance.ready(() => {
					recaptchaReady.set(true);
					validateForm();
				});
				clearInterval(waitForRecaptcha);
			}
		}, 200);

		return () => {
			clearInterval(waitForRecaptcha);
		};
	});
</script>

<svelte:head>
	<script
		src="https://www.google.com/recaptcha/api.js?render={import.meta.env
			.VITE_RECAPTCHA_V3_SITE_KEY}"
	></script>
</svelte:head>

<LayoutGrid>
	<!-- メールコンタクトフォーム -->
	<Cell span={12}>
		<div class="demo-cell">
			<Textfield
				style="width: 100%;"
				helperLine$style="width: 100%;"
				bind:value={valueA}
				label="お名前／件名"
				required
				on:input={validateForm}
			>
				<HelperText slot="helper"
					>お問合せされた方のお名前、もしくはお問合せの件名をご入力ください（必須）</HelperText
				>
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
				<HelperText slot="helper"
					>ご返信先となるメールアドレスをご入力ください（必須）</HelperText
				>
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
				<HelperText slot="helper"
					>お問合せ内容の詳細についてご入力ください（必須）</HelperText
				>
			</Textfield>
			<!-- Honeypot field -->
			<Textfield
				style="width: 100%; display:none;"
				bind:value={honeyfield}
				label="Honeyfield"
				on:input={validateForm}
			/>
		</div>
	</Cell>
	<Cell span={12}>
		<div class="demo-cell">
			<FormField>
				<Checkbox bind:checked on:change={validateForm} />
				<span slot="label">プライバシーポリシーに同意の上送信</span>
			</FormField>
		</div>
	</Cell>
	<Cell span={6}></Cell>
	<Cell span={6}>
		<div class="demo-cell-right">
			<Button on:click={() => (open = true)} variant="raised" disabled={$isButtonDisabled}>
				<Label>この内容で送信する</Label>
			</Button>
		</div>
	</Cell>
</LayoutGrid>

<Dialog bind:open aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">お問合せの送信</Title>
	<Content id="simple-content">この内容でお問合せを送信します、よろしいでしょうか？</Content>
	<Actions>
		<Button on:click={sendEmail}>
			<Label>はい</Label>
		</Button>
		<Button>
			<Label>いいえ</Label>
		</Button>
	</Actions>
</Dialog>

<Dialog bind:open={$openDialog} aria-labelledby="simple-title" aria-describedby="simple-content">
	<!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
	<Title id="simple-title">{$dialogTitle}</Title>
	<Content id="simple-content">{$dialogMessage}</Content>
	<Actions>
		<Button on:click={() => openDialog.set(false)}>
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
