/**
 * SVG文字列中の <use href="#id"/> を、参照先の要素そのものに置き換える。
 *
 * Mermaidはアイコンを描画する際にSVGをサニタイズし、<use> 要素を取り除く。
 * iconifyのアイコンには <defs> の図形を <use> で参照し、それを <mask> に使うものがあり
 * （例: vscode-icons:file-type-gemini）、<use> が消えるとマスクが空になって
 * アイコン全体が見えなくなる。事前に参照を展開しておけばサニタイズの影響を受けない。
 *
 * 参照先が自己終了タグ（<path .../> 等）の場合のみ展開し、それ以外は元のまま残す。
 */
export function inlineSvgUse(body: string): string {
	if (!body.includes('<use')) return body;

	return body.replace(
		/<use\s([^>]*?)(?:xlink:)?href="#([\w-]+)"([^>]*?)\/>/g,
		(match, before: string, id: string, after: string) => {
			const target = body.match(new RegExp(`<\\w+\\s[^>]*\\bid="${id}"[^>]*/>`));
			if (!target) return match;

			// 複製なのでidは外す（同じidが複数あるとmask等の参照先が曖昧になる）
			const element = target[0].replace(new RegExp(`\\s+id="${id}"`), '');
			const extraAttrs = `${before} ${after}`.trim();
			// <use> 側の属性（transform/fill等）はgで包んで引き継ぐ
			return extraAttrs ? `<g ${extraAttrs}>${element}</g>` : element;
		}
	);
}

/** iconifyのアイコンセット全体に inlineSvgUse を適用する */
export function inlineIconSetUses<T extends { icons: Record<string, { body: string }> }>(
	iconSet: T
): T {
	const icons = Object.fromEntries(
		Object.entries(iconSet.icons).map(([name, icon]) => [
			name,
			{ ...icon, body: inlineSvgUse(icon.body) }
		])
	);
	return { ...iconSet, icons };
}
