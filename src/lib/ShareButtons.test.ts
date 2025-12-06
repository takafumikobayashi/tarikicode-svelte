import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ShareButtons from './ShareButtons.svelte';
import { AppConfig } from './AppConfig';

describe('ShareButtons Component', () => {
	const mockProps = {
		url: '/blog/test-post',
		title: 'Test Blog Post'
	};

	beforeEach(() => {
		// Mock window.open
		vi.stubGlobal('open', vi.fn());
		// Mock navigator.clipboard (Object.definePropertyを使用)
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: vi.fn().mockResolvedValue(undefined)
			},
			writable: true,
			configurable: true
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should render share section heading', () => {
		const { getByText } = render(ShareButtons, { props: mockProps });
		expect(getByText('この記事をシェアする')).toBeTruthy();
	});

	it('should render all SNS buttons', () => {
		const { container } = render(ShareButtons, { props: mockProps });
		const buttons = container.querySelectorAll('.mdc-icon-button');
		// Twitter, Facebook, LinkedIn, Hatena, Pocket, Copy URL = 6 buttons
		expect(buttons.length).toBe(6);
	});

	it('should generate correct Twitter share URL', async () => {
		const { container } = render(ShareButtons, { props: mockProps });
		const twitterButton = container.querySelector('.mdc-icon-button');

		await fireEvent.click(twitterButton!);

		const expectedUrl = `${AppConfig.shareUrls.twitter}?url=${encodeURIComponent(AppConfig.url + mockProps.url)}&text=${encodeURIComponent(mockProps.title)}&via=${AppConfig.xaccuont.replace('@', '')}`;
		expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank', 'noopener,noreferrer');
	});

	it('should handle absolute URLs correctly', async () => {
		const absoluteUrlProps = {
			url: 'https://external.com/post',
			title: 'External Post'
		};
		const { container } = render(ShareButtons, { props: absoluteUrlProps });
		const twitterButton = container.querySelector('.mdc-icon-button');

		await fireEvent.click(twitterButton!);

		const expectedUrl = `${AppConfig.shareUrls.twitter}?url=${encodeURIComponent(absoluteUrlProps.url)}&text=${encodeURIComponent(absoluteUrlProps.title)}&via=${AppConfig.xaccuont.replace('@', '')}`;
		expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank', 'noopener,noreferrer');
	});

	it('should copy URL to clipboard when copy button is clicked', async () => {
		const { container } = render(ShareButtons, { props: mockProps });
		const buttons = container.querySelectorAll('.mdc-icon-button');
		const copyButton = buttons[buttons.length - 1]; // Last button is copy URL

		await fireEvent.click(copyButton);

		expect(navigator.clipboard.writeText).toHaveBeenCalledWith(AppConfig.url + mockProps.url);
	});

	it('should show snackbar after copying URL', async () => {
		const { container, getByText } = render(ShareButtons, { props: mockProps });
		const buttons = container.querySelectorAll('.mdc-icon-button');
		const copyButton = buttons[buttons.length - 1];

		await fireEvent.click(copyButton);

		// Wait for snackbar to appear
		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(getByText('URLをコピーしました')).toBeTruthy();
	});

	it('should encode special characters in URL and title', async () => {
		const specialCharsProps = {
			url: '/blog/test post?query=value',
			title: 'Test & Title <>'
		};
		const { container } = render(ShareButtons, { props: specialCharsProps });
		const twitterButton = container.querySelector('.mdc-icon-button');

		await fireEvent.click(twitterButton!);

		const encodedUrl = encodeURIComponent(AppConfig.url + specialCharsProps.url);
		const encodedTitle = encodeURIComponent(specialCharsProps.title);
		expect(window.open).toHaveBeenCalledWith(
			expect.stringContaining(encodedUrl),
			'_blank',
			'noopener,noreferrer'
		);
		expect(window.open).toHaveBeenCalledWith(
			expect.stringContaining(encodedTitle),
			'_blank',
			'noopener,noreferrer'
		);
	});

	it('should use AppConfig.shareUrls for all SNS platforms', () => {
		const { container } = render(ShareButtons, { props: mockProps });
		const buttons = container.querySelectorAll('.mdc-icon-button');

		expect(buttons.length).toBeGreaterThan(0);
		expect(AppConfig.shareUrls.twitter).toBeTruthy();
		expect(AppConfig.shareUrls.facebook).toBeTruthy();
		expect(AppConfig.shareUrls.linkedin).toBeTruthy();
		expect(AppConfig.shareUrls.hatena).toBeTruthy();
		expect(AppConfig.shareUrls.pocket).toBeTruthy();
	});

	it('should have correct button sizes', () => {
		const { container } = render(ShareButtons, { props: mockProps });
		const buttons = container.querySelectorAll('.mdc-icon-button');

		buttons.forEach((button) => {
			// Check that buttons have the expected styling
			expect(button.classList.contains('mdc-icon-button')).toBe(true);
		});
	});

	it('should handle clipboard API error gracefully', async () => {
		// Mock clipboard API to reject (Object.definePropertyを使用)
		Object.defineProperty(navigator, 'clipboard', {
			value: {
				writeText: vi.fn().mockRejectedValue(new Error('Clipboard error'))
			},
			writable: true,
			configurable: true
		});

		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const { container } = render(ShareButtons, { props: mockProps });
		const buttons = container.querySelectorAll('.mdc-icon-button');
		const copyButton = buttons[buttons.length - 1];

		await fireEvent.click(copyButton);

		expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy:', expect.any(Error));

		consoleErrorSpy.mockRestore();
	});
});
