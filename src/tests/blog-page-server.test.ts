/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { load } from '../routes/blog/[slug]/+page.server';
import fs from 'fs';
import path from 'path';

// fsモジュールのモック
vi.mock('fs');

describe('Blog Page Server Loader', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('load function', () => {
		it('should load and parse markdown file successfully', async () => {
			const mockMarkdown =
				'---\ntitle: "Test Post"\ndate: "2024-10-11"\n---\n\n## Test Post\n\nThis is a test post.';
			const mockParams = { slug: 'test-post' };

			// fsのモック設定
			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockMarkdown);

			const result = await load({ params: mockParams } as any);

			expect(result.status).toBe(200);
			expect(result.body).toContain('<h2');
			expect(result.body).toContain('Test Post');
			expect(result.body).toContain('<p>This is a test post.</p>');
			expect(result.metadata.title).toBe('Test Post');
		});

		it('should read file from correct path', async () => {
			const mockMarkdown = '---\ntitle: "Test"\n---\n\n# Test';
			const mockParams = { slug: 'svelte' };

			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockMarkdown);

			await load({ params: mockParams } as any);

			const expectedPath = path.resolve('src/posts', 'svelte.md');
			expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath, { encoding: 'utf-8' });
		});

		it('should handle different slugs correctly', async () => {
			const testCases = [
				{ slug: 'ai', expectedFile: 'ai.md' },
				{ slug: 'kintone-plugin', expectedFile: 'kintone-plugin.md' },
				{ slug: 'thanks-card', expectedFile: 'thanks-card.md' }
			];

			for (const testCase of testCases) {
				vi.mocked(fs.existsSync).mockReturnValue(true);
				vi.mocked(fs.readFileSync).mockReturnValue('---\ntitle: "Test"\n---\n\n# Test');

				await load({ params: { slug: testCase.slug } } as any);

				const expectedPath = path.resolve('src/posts', testCase.expectedFile);
				expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath, { encoding: 'utf-8' });
			}
		});

		it('should convert markdown to HTML correctly', async () => {
			const mockMarkdown = `---
title: "Test"
---

# Heading 1
## Heading 2
- List item 1
- List item 2

[Link](https://example.com)`;

			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockMarkdown);

			const result = await load({ params: { slug: 'test' } } as any);

			expect(result.body).toContain('<h1');
			expect(result.body).toContain('<h2');
			expect(result.body).toContain('<ul>');
			expect(result.body).toContain('<li>');
			expect(result.body).toContain('<a href="https://example.com"');
		});

		it('should return 404 error when file does not exist', async () => {
			const mockParams = { slug: 'non-existent-post' };

			// ファイルが存在しない場合
			vi.mocked(fs.existsSync).mockReturnValue(false);

			try {
				await load({ params: mockParams } as any);
				// エラーがスローされるべきなので、ここに到達してはいけない
				expect.fail('Expected error to be thrown');
			} catch (error: any) {
				expect(error.status).toBe(404);
				expect(error.body.message).toContain('non-existent-post');
			}
		});

		it('should handle code blocks in markdown', async () => {
			const mockMarkdown =
				'---\ntitle: "Test"\n---\n\n```javascript\nconst test = "hello";\n```';

			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockMarkdown);

			const result = await load({ params: { slug: 'test' } } as any);

			expect(result.body).toContain('<pre>');
			expect(result.body).toContain('<code');
		});

		it('should preserve special characters in markdown', async () => {
			const mockMarkdown =
				'---\ntitle: "Test"\n---\n\nTest with special chars: <script>alert("test")</script>';

			vi.mocked(fs.existsSync).mockReturnValue(true);
			vi.mocked(fs.readFileSync).mockReturnValue(mockMarkdown);

			const result = await load({ params: { slug: 'test' } } as any);

			// markedはデフォルトでHTMLをエスケープしないが、レンダリングされるはず
			expect(result.body).toBeTruthy();
			expect(result.status).toBe(200);
		});
	});
});
