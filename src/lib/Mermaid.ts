import type { MermaidTheme } from './mermaidRenderer';

// mermaid本体（とアイコンパック）は数MB規模になる。
// このファイルはHeader経由で全ページから読み込まれるため、ここでは静的importせず、
// 図が存在するページでだけ描画モジュールを動的importする。

/** ページ内にMermaid図（未描画のコードブロック or 描画済みコンテナ）があるか */
export function hasMermaidDiagrams(root: ParentNode = document): boolean {
	return root.querySelector('code.language-mermaid, div.mermaid') !== null;
}

/**
 * 現在表示中のテーマでMermaid図を描画する（記事ページの初回表示・記事切り替え時用）。
 * テーマはapp.htmlのインラインスクリプトが描画前にbody[data-theme]へ設定している
 */
export function renderMermaidForCurrentTheme() {
	if (typeof document === 'undefined') return;
	setMermaidTheme(document.body.dataset.theme === 'dark');
}

// Mermaidテーマを設定する関数
export function setMermaidTheme(isDarkMode: boolean) {
	if (typeof document === 'undefined' || !hasMermaidDiagrams()) {
		return;
	}

	const theme: MermaidTheme = isDarkMode ? 'dark' : 'default';

	void import('./mermaidRenderer')
		.then(({ renderMermaidDiagrams }) => renderMermaidDiagrams(theme))
		.catch((error) => console.error('Mermaid rendering failed:', error));
}
