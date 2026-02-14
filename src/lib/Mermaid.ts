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

// Mermaid用の図をレンダリングする関数
export function renderMermaidDiagrams(theme: 'default' | 'dark' | 'forest' | 'neutral' | 'base') {
	// 初回描画
	const mermaidElements = document.querySelectorAll('code.language-mermaid');
	if (mermaidElements.length > 0) {
		mermaidElements.forEach(async (element, index) => {
			const mermaidCode = element.textContent || '';

			// Mermaid用のコンテナを作成
			const mermaidContainer = document.createElement('div');
			mermaidContainer.classList.add('mermaid');
			mermaidContainer.dataset.mermaidCode = mermaidCode;
			mermaidContainer.id = `mermaid-container-${index}`; // ユニークIDを設定
			mermaidContainer.innerHTML = mermaidCode;

			// 元のcode.language-mermaid要素をdiv.mermaidに置き換える
			element.replaceWith(mermaidContainer);

			// Mermaidを再初期化して図を描画
			mermaid.initialize({
				startOnLoad: false,
				theme,
				securityLevel: 'loose', // foreignObject内のHTMLを許可
				fontFamily: 'system-ui, -apple-system, sans-serif',
				flowchart: {
					htmlLabels: true, // HTMLラベルを有効化
					useMaxWidth: true
				}
			});
			await mermaid.run({
				querySelector: '.mermaid'
			});
		});
	} else {
		// 2回目以降の描画
		const processedMermaidElements = document.querySelectorAll<HTMLDivElement>('div.mermaid');
		processedMermaidElements.forEach(async (element, index) => {
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
			newMermaidContainer.innerHTML = mermaidCode;

			// 元のdiv.mermaid要素の内容を新しいコンテナで置き換える
			element.replaceWith(newMermaidContainer);

			// Mermaidを再初期化して図を再描画
			mermaid.initialize({
				startOnLoad: false,
				theme,
				securityLevel: 'loose', // foreignObject内のHTMLを許可
				fontFamily: 'system-ui, -apple-system, sans-serif',
				flowchart: {
					htmlLabels: true, // HTMLラベルを有効化
					useMaxWidth: true
				}
			});
			await mermaid.run({
				querySelector: '.mermaid'
			});
		});
	}
}

// Mermaidテーマを設定する関数
export function setMermaidTheme(isDarkMode: boolean) {
	const theme = isDarkMode ? 'dark' : 'default'; // ダークモードなら'dark'、ライトモードなら'default'

	// Mermaidのテーマを変更して再描画
	renderMermaidDiagrams(theme); // Mermaidの図を再描画
}
