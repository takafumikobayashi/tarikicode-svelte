import { describe, it, expect } from 'vitest';
import { inlineSvgUse, inlineIconSetUses } from './inlineSvgUse';

describe('inlineSvgUse', () => {
	it('<use href="#id"/> を参照先の要素に置き換え、複製からidを外す', () => {
		const body =
			'<defs><path id="p1" fill="#fff" d="M0 0h1"/></defs><mask id="m"><use href="#p1"/></mask>';
		const out = inlineSvgUse(body);
		expect(out).not.toContain('<use');
		expect(out).toContain('<mask id="m"><path fill="#fff" d="M0 0h1"/></mask>');
		// 元の定義は残る
		expect(out).toContain('<path id="p1"');
	});

	it('<use> 側の属性はgで包んで引き継ぐ', () => {
		const body = '<defs><path id="p1" d="M0 0"/></defs><use transform="scale(2)" href="#p1"/>';
		expect(inlineSvgUse(body)).toContain('<g transform="scale(2)"><path d="M0 0"/></g>');
	});

	it('xlink:href にも対応する', () => {
		const body = '<defs><circle id="c" r="1"/></defs><use xlink:href="#c"/>';
		expect(inlineSvgUse(body)).toContain('<circle r="1"/>');
	});

	it('参照先が見つからない・自己終了タグでない場合は元のまま', () => {
		const missing = '<use href="#none"/>';
		expect(inlineSvgUse(missing)).toBe(missing);
		const nested = '<defs><g id="g1"><path d="M0"/></g></defs><use href="#g1"/>';
		expect(inlineSvgUse(nested)).toBe(nested);
	});

	it('<use> を含まないアイコンはそのまま返す', () => {
		const body = '<path d="M0 0"/>';
		expect(inlineSvgUse(body)).toBe(body);
	});

	it('アイコンセット全体に適用できる', () => {
		const set = {
			prefix: 'x',
			icons: { a: { body: '<defs><path id="p" d="M0"/></defs><use href="#p"/>' } }
		};
		const out = inlineIconSetUses(set);
		expect(out.prefix).toBe('x');
		expect(out.icons.a.body).not.toContain('<use');
	});
});
