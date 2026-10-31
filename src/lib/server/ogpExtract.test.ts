// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { extractOgpTag, extractMetaTag, extractTag } from './ogpExtract';

describe('extractOgpTag / extractMetaTag', () => {
	it('property → content の順で取得する', () => {
		const html = '<meta property="og:title" content="タイトル">';
		expect(extractOgpTag(html, 'og:title')).toBe('タイトル');
	});

	it('content → name の順でも取得する', () => {
		const html = '<meta content="説明文" name="description">';
		expect(extractMetaTag(html, 'description')).toBe('説明文');
	});

	it('シングルクォートの値に含まれるダブルクォートで切れない（RFC 9309のページ）', () => {
		const html = `<meta content='This document extends the "Robots Exclusion Protocol" method' name="description">`;
		expect(extractMetaTag(html, 'description')).toBe(
			'This document extends the "Robots Exclusion Protocol" method'
		);
	});

	it('ダブルクォートの値に含まれるアポストロフィで切れない', () => {
		const html = `<meta name="description" content="Manage your site's inclusion">`;
		expect(extractMetaTag(html, 'description')).toBe("Manage your site's inclusion");
	});

	it('改行や連続空白を1つの空白にまとめる', () => {
		const html = `<meta name="description" content="
        first line
        second line  ">`;
		expect(extractMetaTag(html, 'description')).toBe('first line second line');
	});

	it('name="og:xxx" 形式にも対応し、空の値は空文字を返す', () => {
		expect(extractOgpTag('<meta name="og:image" content="https://a/b.png">', 'og:image')).toBe(
			'https://a/b.png'
		);
		expect(extractOgpTag('<meta property="og:description" content="">', 'og:description')).toBe(
			''
		);
	});

	it('値が後続のタグにまたがって取り込まれない', () => {
		const html =
			'<meta content="A" property="og:image:alt"><meta name="x" content="B" property="og:title">';
		expect(extractOgpTag(html, 'og:title')).toBe('B');
		expect(
			extractMetaTag('<meta content="A" name="x"><meta name="description">', 'description')
		).toBe('');
	});

	it('別のキーのmetaタグの値を取り違えない', () => {
		const html =
			'<meta property="og:image:alt" content="代替テキスト"><meta property="og:image" content="https://a/b.png">';
		expect(extractOgpTag(html, 'og:image')).toBe('https://a/b.png');
	});
});

describe('extractTag', () => {
	it('titleタグの中身を取り出して空白を整える', () => {
		expect(extractTag('<title>\n  ページ名  \n</title>', 'title')).toBe('ページ名');
	});
});
