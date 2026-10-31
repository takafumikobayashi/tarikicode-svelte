import { describe, it, expect } from 'vitest';
import { renderCodeBlock } from './highlightCode';

describe('renderCodeBlock', () => {
	it('既知の言語はhljsのspanでハイライトする', () => {
		const html = renderCodeBlock('const a = 1;', 'ts');
		expect(html).toContain('class="hljs language-ts"');
		expect(html).toContain('<span class="hljs-keyword">const</span>');
	});

	it('mermaid / chartjs はハイライトせずエスケープだけして残す', () => {
		const html = renderCodeBlock('A-->B<script>', 'mermaid');
		expect(html).toBe(
			'<pre><code class="language-mermaid">A--&gt;B&lt;script&gt;</code></pre>\n'
		);
		expect(renderCodeBlock('{"type":"bar"}', 'chartjs')).toContain('class="language-chartjs"');
	});

	it('未知の言語は色付けせずエスケープする', () => {
		const html = renderCodeBlock('<b>x</b>', 'unknownlang');
		expect(html).toBe(
			'<pre><code class="hljs language-unknownlang">&lt;b&gt;x&lt;/b&gt;</code></pre>\n'
		);
	});

	it('言語指定なしは自動判定しhljsクラスを付ける', () => {
		const html = renderCodeBlock('<div>hi</div>', '');
		expect(html.startsWith('<pre><code class="hljs">')).toBe(true);
		expect(html).not.toContain('<div>');
	});

	it('infostringの言語名に含まれる記号はエスケープされる', () => {
		const html = renderCodeBlock('x', '"><img>');
		expect(html).not.toContain('"><img>');
	});
});
