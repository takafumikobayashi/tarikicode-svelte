import hljs from 'highlight.js';

// クライアント側で描画するため、ここではハイライトせずそのまま残す言語
const CLIENT_RENDERED_LANGS = new Set(['mermaid', 'chartjs']);

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

/**
 * Markdownのコードブロックを<pre><code>のHTMLに変換する（サーバー側で実行）。
 * highlight.jsの処理をSSRで済ませることで、クライアントへhighlight.js本体を送らずに済む。
 *
 * @param code コードブロックの中身（エスケープ前の生テキスト）
 * @param infostring ```の直後に書かれた文字列（例: "ts", "mermaid", ""）
 */
export function renderCodeBlock(code: string, infostring: string | undefined): string {
	const lang = (infostring ?? '').trim().split(/\s+/)[0].toLowerCase();

	if (CLIENT_RENDERED_LANGS.has(lang)) {
		return `<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>\n`;
	}

	if (lang && hljs.getLanguage(lang)) {
		const { value } = hljs.highlight(code, { language: lang, ignoreIllegals: true });
		return `<pre><code class="hljs language-${escapeHtml(lang)}">${value}</code></pre>\n`;
	}

	// 言語指定なし：従来のクライアント側highlightBlockと同じく自動判定する
	if (!lang) {
		const { value } = hljs.highlightAuto(code);
		return `<pre><code class="hljs">${value}</code></pre>\n`;
	}

	// 未知の言語名（text, jj など）：誤判定を避けて色付けせずに出す
	return `<pre><code class="hljs language-${escapeHtml(lang)}">${escapeHtml(code)}</code></pre>\n`;
}
