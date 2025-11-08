/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../routes/api/ogp/+server';

// グローバルfetchのモック
global.fetch = vi.fn();

// fetchレスポンスモックを作成するヘルパー関数
function createMockFetchResponse(html: string, contentType: string | null = null) {
	const encoder = new TextEncoder();
	const htmlBuffer = encoder.encode(html);

	return {
		ok: true,
		arrayBuffer: async () => htmlBuffer.buffer,
		headers: {
			get: (name: string) => (name === 'content-type' ? contentType : null)
		}
	};
}

describe('OGP API Endpoint', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('GET handler', () => {
		it('should return 400 when URL parameter is missing', async () => {
			const mockUrl = new URL('http://localhost/api/ogp');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(response.status).toBe(400);
			expect(data.error).toBe('URL parameter is required');
		});

		it('should fetch and parse OGP data successfully', async () => {
			const mockHtml = `
				<html>
					<head>
						<meta property="og:title" content="Test Title" />
						<meta property="og:description" content="Test Description" />
						<meta property="og:image" content="https://example.com/image.jpg" />
						<meta property="og:site_name" content="Test Site" />
					</head>
				</html>
			`;

			vi.mocked(global.fetch).mockResolvedValue(createMockFetchResponse(mockHtml) as any);

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(response.status).toBe(200);
			expect(data.title).toBe('Test Title');
			expect(data.description).toBe('Test Description');
			expect(data.image).toBe('https://example.com/image.jpg');
			expect(data.siteName).toBe('Test Site');
		});

		it('should fallback to <title> tag when og:title is missing', async () => {
			const mockHtml = `
				<html>
					<head>
						<title>Fallback Title</title>
					</head>
				</html>
			`;

			vi.mocked(global.fetch).mockResolvedValue(createMockFetchResponse(mockHtml) as any);

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(data.title).toBe('Fallback Title');
		});

		it('should fallback to <meta name="description"> when og:description is missing', async () => {
			const mockHtml = `
				<html>
					<head>
						<meta name="description" content="Fallback Description" />
					</head>
				</html>
			`;

			vi.mocked(global.fetch).mockResolvedValue(createMockFetchResponse(mockHtml) as any);

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(data.description).toBe('Fallback Description');
		});

		it('should use empty string when og:site_name is missing', async () => {
			const mockHtml = '<html><head></head></html>';

			vi.mocked(global.fetch).mockResolvedValue(createMockFetchResponse(mockHtml) as any);

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com/page');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(data.siteName).toBe('');
		});

		it('should include User-Agent header in fetch request', async () => {
			const mockHtml = '<html></html>';

			vi.mocked(global.fetch).mockResolvedValue(createMockFetchResponse(mockHtml) as any);

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com');
			const request = { url: mockUrl };

			await GET(request as any);

			expect(global.fetch).toHaveBeenCalledWith(
				'https://example.com',
				expect.objectContaining({
					headers: expect.objectContaining({
						'User-Agent': 'tariki-code-bot/1.0 (+https://tariki-code.tokyo)'
					})
				})
			);
		});

		it('should return error when target URL fetch fails', async () => {
			vi.mocked(global.fetch).mockResolvedValue({
				ok: false,
				status: 404
			} as any);

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe('Failed to fetch OGP data');
		});

		it('should return 500 when fetch throws an error', async () => {
			vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(response.status).toBe(500);
			expect(data.error).toBe('Failed to fetch OGP data');
		});

		it('should handle URLs with special characters', async () => {
			const mockHtml =
				'<html><head><meta property="og:title" content="Test" /></head></html>';

			vi.mocked(global.fetch).mockResolvedValue(createMockFetchResponse(mockHtml) as any);

			const encodedUrl = encodeURIComponent('https://example.com/page?query=test&foo=bar');
			const mockUrl = new URL(`http://localhost/api/ogp?url=${encodedUrl}`);
			const request = { url: mockUrl };

			await GET(request as any);

			expect(global.fetch).toHaveBeenCalledWith(
				'https://example.com/page?query=test&foo=bar',
				expect.any(Object)
			);
		});

		it('should handle empty OGP values', async () => {
			const mockHtml = `
				<html>
					<head>
						<meta property="og:title" content="" />
						<meta property="og:description" content="" />
					</head>
				</html>
			`;

			vi.mocked(global.fetch).mockResolvedValue(createMockFetchResponse(mockHtml) as any);

			const mockUrl = new URL('http://localhost/api/ogp?url=https://example.com');
			const request = { url: mockUrl };

			const response = await GET(request as any);
			const data = await response.json();

			expect(data.title).toBe('');
			expect(data.description).toBe('');
		});
	});
});
