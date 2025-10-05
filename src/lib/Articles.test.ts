import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import Articles from './Articles.svelte';

// グローバルfetchのモック
global.fetch = vi.fn();

describe('Articles Component', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should render the component', () => {
		vi.mocked(global.fetch).mockImplementation(
			() => new Promise(() => {}) // 永遠に解決しないPromise
		);

		const { container } = render(Articles);
		expect(container).toBeTruthy();
	});

	it('should render Speaker Deck embeds', () => {
		vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

		const { container } = render(Articles);
		const iframes = container.querySelectorAll('.speakerdeck-iframe');
		expect(iframes.length).toBeGreaterThanOrEqual(1);
	});

	it('should render Note embed', () => {
		vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

		const { container } = render(Articles);
		const noteEmbed = container.querySelector('.note-embed');
		expect(noteEmbed).toBeTruthy();
	});

	it('should have layout grid', () => {
		vi.mocked(global.fetch).mockImplementation(() => new Promise(() => {}));

		const { container } = render(Articles);
		const grid = container.querySelector('.mdc-layout-grid');
		expect(grid).toBeTruthy();
	});
});
