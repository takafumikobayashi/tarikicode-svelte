// HTMLからOGP・metaタグの値を取り出すヘルパー（/api/ogp で使用）

function escapeRegex(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 属性値の改行・連続空白を1つの空白にまとめる（RFC等は整形のためdescriptionに改行を含む）
function normalizeSpace(value: string): string {
	return value.replace(/\s+/g, ' ').trim();
}

/**
 * <meta {attr}="{key}" content="..."> の content を返す（属性の順序は問わない）。
 * 値は開き引用符と同じ引用符で閉じるまでを取る。content='... "Robots" ...' や
 * content="... site's ..." のように、値の中に反対側の引用符を含むページがあるため。
 */
function extractMetaContent(html: string, attr: 'property' | 'name', key: string): string {
	const safeKey = escapeRegex(key);
	// 値は「開き引用符と同じ文字を含まない並び」に限る。任意文字にすると、一致しないときに
	// 正規表現が後戻りして閉じ引用符を越え、後続のタグまで値に取り込んでしまう
	const patterns = [
		// key → content の順。グループ: 1=keyの引用符, 2=contentの引用符, 3=値
		new RegExp(
			`<meta\\b[^>]*?${attr}\\s*=\\s*(["'])${safeKey}\\1[^>]*?content\\s*=\\s*(["'])((?:(?!\\2)[\\s\\S])*)\\2`,
			'i'
		),
		// content → key の順。グループ: 1=contentの引用符, 2=値, 3=keyの引用符
		new RegExp(
			`<meta\\b[^>]*?content\\s*=\\s*(["'])((?:(?!\\1)[\\s\\S])*)\\1[^>]*?${attr}\\s*=\\s*(["'])${safeKey}\\3`,
			'i'
		)
	];

	const keyFirst = html.match(patterns[0]);
	if (keyFirst) return normalizeSpace(keyFirst[3]);
	const contentFirst = html.match(patterns[1]);
	if (contentFirst) return normalizeSpace(contentFirst[2]);
	return '';
}

// OGPタグ（property="og:xxx" と name="og:xxx" の両方に対応）
export function extractOgpTag(html: string, property: string): string {
	return (
		extractMetaContent(html, 'property', property) || extractMetaContent(html, 'name', property)
	);
}

// 通常のmetaタグ（name="description" 等）
export function extractMetaTag(html: string, name: string): string {
	return extractMetaContent(html, 'name', name);
}

export function extractTag(html: string, tag: string): string {
	const regex = new RegExp(`<${tag}[^>]*>([^<]+)</${tag}>`, 'i');
	const match = html.match(regex);
	return match ? normalizeSpace(match[1]) : '';
}
