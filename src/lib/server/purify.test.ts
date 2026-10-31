// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { createPurifier } from './purify';

describe('createPurifier', () => {
	it('先頭の見出しタグを残す', () => {
		const out = createPurifier().sanitize('<h3 id="a">タイトル</h3>\n<p>本文</p>');
		expect(out).toBe('<h3 id="a">タイトル</h3>\n<p>本文</p>');
	});

	it('先頭以外の要素も走査され、危険な要素・属性が除去される', () => {
		const out = createPurifier().sanitize(
			'<p>a</p><img src="x" onerror="alert(1)"><script>alert(2)</script>'
		);
		expect(out).toBe('<p>a</p><img src="x">');
	});
});
