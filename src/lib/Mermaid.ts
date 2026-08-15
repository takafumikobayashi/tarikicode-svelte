import mermaid from 'mermaid';
import { icons as logos } from '@iconify-json/logos';
import { icons as cib } from '@iconify-json/cib';
import { icons as ic } from '@iconify-json/ic';
import { icons as vscodeicons } from '@iconify-json/vscode-icons';

mermaid.registerIconPacks([
	{
		name: logos.prefix, // To use the prefix defined in the icon pack
		icons: logos
	},
	{
		name: cib.prefix, // To use the prefix defined in the icon pack
		icons: cib
	},
	{
		name: ic.prefix, // To use the prefix defined in the icon pack
		icons: ic
	},
	{
		name: vscodeicons.prefix, // To use the prefix defined in the icon pack
		icons: vscodeicons
	}
]);

type MermaidTheme = 'default' | 'dark' | 'forest' | 'neutral' | 'base';

/**
 * ガント図に渡す描画幅（px）を決める。
 *
 * フローチャート等は図の内容から自分の幅を計算するが、ガント図だけは
 * 描画時に「親要素のoffsetWidth」を見る実装になっている。
 * mermaid.run()は一時要素へ描画してからHTMLを差し込むため、その一時要素は
 * レイアウトに載っておらず、offsetWidthがSVGの既定値である300pxになってしまう。
 * ここで実際のコンテナ幅を返して上書きすると、他の図と同じ幅で描画される。
 *
 * @param containers 実際に図が差し込まれるdiv.mermaid要素の一覧
 * @returns 描画幅（px）。undefinedを返すとMermaid既定の挙動に戻る
 */
function resolveGanttWidth(containers: HTMLElement[]): number | undefined {
	// 記事内の図はすべて同じ本文カラムに入るため、先頭の1つを測れば足りる。
	// この幅が余白を差し引いた後に使える最大幅なので、上限はかけない。
	const width = containers[0]?.offsetWidth ?? 0;

	// 描画前や非表示タブではoffsetWidthが0になる。0を渡すと図が潰れるため、
	// undefinedを返してMermaid既定の挙動に委ね、次の再描画で実測値に置き換える。
	return width > 0 ? width : undefined;
}

// Mermaidを初期化する（テーマ切り替えのたびに呼ばれる）
function initializeMermaid(theme: MermaidTheme, containers: HTMLElement[]) {
	mermaid.initialize({
		startOnLoad: false,
		theme,
		securityLevel: 'loose', // foreignObject内のHTMLを許可
		fontFamily: 'system-ui, -apple-system, sans-serif',
		flowchart: {
			htmlLabels: true, // HTMLラベルを有効化
			useMaxWidth: true
		},
		gantt: {
			useMaxWidth: true,
			useWidth: resolveGanttWidth(containers)
		}
	});
}

// Mermaid用の図をレンダリングする関数
export async function renderMermaidDiagrams(theme: MermaidTheme) {
	// 初回描画
	const mermaidElements = document.querySelectorAll('code.language-mermaid');
	if (mermaidElements.length > 0) {
		const containers: HTMLDivElement[] = [];

		mermaidElements.forEach((element, index) => {
			const mermaidCode = element.textContent || '';

			// Mermaid用のコンテナを作成
			const mermaidContainer = document.createElement('div');
			mermaidContainer.classList.add('mermaid');
			mermaidContainer.dataset.mermaidCode = mermaidCode;
			mermaidContainer.id = `mermaid-container-${index}`; // ユニークIDを設定
			mermaidContainer.textContent = mermaidCode;

			// 元のcode.language-mermaid要素をdiv.mermaidに置き換える
			element.replaceWith(mermaidContainer);
			containers.push(mermaidContainer);
		});

		// 全コンテナを差し込んで実寸が確定してから、まとめて描画する
		initializeMermaid(theme, containers);
		await mermaid.run({ nodes: containers });
	} else {
		// 2回目以降の描画
		const processedMermaidElements = document.querySelectorAll<HTMLDivElement>('div.mermaid');
		const containers: HTMLDivElement[] = [];

		processedMermaidElements.forEach((element, index) => {
			const mermaidCode = element.dataset.mermaidCode || '';
			if (!mermaidCode) {
				console.error('Mermaid code not found for element:', element);
				return; // コードがない場合はスキップ
			}

			// 新しい div.mermaid コンテナを作成
			const newMermaidContainer = document.createElement('div');
			newMermaidContainer.classList.add('mermaid');
			newMermaidContainer.dataset.mermaidCode = mermaidCode;
			newMermaidContainer.id = `processed-mermaid-container-${index}`;
			// ラベル内の<br/>がHTMLとして解釈されないようテキストとして入れる
			newMermaidContainer.textContent = mermaidCode;

			// 元のdiv.mermaid要素の内容を新しいコンテナで置き換える
			element.replaceWith(newMermaidContainer);
			containers.push(newMermaidContainer);
		});

		initializeMermaid(theme, containers);
		await mermaid.run({ nodes: containers });
	}
}

// Mermaidテーマを設定する関数
export function setMermaidTheme(isDarkMode: boolean) {
	const theme: MermaidTheme = isDarkMode ? 'dark' : 'default'; // ダークモードなら'dark'、ライトモードなら'default'

	// Mermaidのテーマを変更して再描画
	void renderMermaidDiagrams(theme); // Mermaidの図を再描画
}
