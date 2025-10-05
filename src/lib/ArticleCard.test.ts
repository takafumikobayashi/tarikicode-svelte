import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ArticleCard from './ArticleCard.svelte';

describe('ArticleCard Component', () => {
	const mockArticle = {
		title: 'Test Article Title',
		description: 'This is a test description for the article card.',
		url: 'https://example.com/article',
		image: 'https://example.com/image.jpg',
		site: 'example.com'
	};

	it('should render article title', () => {
		const { getByText } = render(ArticleCard, { props: mockArticle });
		expect(getByText('Test Article Title')).toBeTruthy();
	});

	it('should render article description', () => {
		const { getByText } = render(ArticleCard, { props: mockArticle });
		expect(getByText('This is a test description for the article card.')).toBeTruthy();
	});

	it('should render site name', () => {
		const { getByText } = render(ArticleCard, { props: mockArticle });
		expect(getByText('example.com')).toBeTruthy();
	});

	it('should render image when provided', () => {
		const { container } = render(ArticleCard, { props: mockArticle });
		const img = container.querySelector('img');
		expect(img).toBeTruthy();
		expect(img?.src).toBe('https://example.com/image.jpg');
		expect(img?.alt).toBe('Test Article Title');
	});

	it('should not render image container when image is not provided', () => {
		const propsWithoutImage = { ...mockArticle, image: '' };
		const { container } = render(ArticleCard, { props: propsWithoutImage });
		const imageDiv = container.querySelector('.card-image');
		expect(imageDiv).toBeFalsy();
	});

	it('should render as anchor tag with correct href', () => {
		const { container } = render(ArticleCard, { props: mockArticle });
		const link = container.querySelector('a.article-card');
		expect(link).toBeTruthy();
		expect(link?.getAttribute('href')).toBe('https://example.com/article');
	});

	it('should have target="_blank" and rel attributes', () => {
		const { container } = render(ArticleCard, { props: mockArticle });
		const link = container.querySelector('a.article-card');
		expect(link?.getAttribute('target')).toBe('_blank');
		expect(link?.getAttribute('rel')).toBe('noopener noreferrer');
	});

	it('should have article-card class', () => {
		const { container } = render(ArticleCard, { props: mockArticle });
		const card = container.querySelector('.article-card');
		expect(card).toBeTruthy();
	});

	it('should render all required props correctly', () => {
		const { container, getByText } = render(ArticleCard, { props: mockArticle });

		// Title
		expect(getByText('Test Article Title')).toBeTruthy();

		// Description
		expect(getByText('This is a test description for the article card.')).toBeTruthy();

		// Site
		expect(getByText('example.com')).toBeTruthy();

		// Image
		const img = container.querySelector('img');
		expect(img?.src).toBe('https://example.com/image.jpg');

		// URL
		const link = container.querySelector('a.article-card');
		expect(link?.getAttribute('href')).toBe('https://example.com/article');
	});

	it('should handle empty description gracefully', () => {
		const propsWithEmptyDescription = { ...mockArticle, description: '' };
		const { container } = render(ArticleCard, { props: propsWithEmptyDescription });
		const description = container.querySelector('.card-description');
		expect(description).toBeTruthy();
		expect(description?.textContent).toBe('');
	});

	it('should truncate long titles with CSS', () => {
		const longTitle = 'A'.repeat(200);
		const propsWithLongTitle = { ...mockArticle, title: longTitle };
		const { container } = render(ArticleCard, { props: propsWithLongTitle });
		const titleElement = container.querySelector('.card-title');
		expect(titleElement).toBeTruthy();
		expect(titleElement?.textContent).toBe(longTitle);
	});

	it('should truncate long descriptions with CSS', () => {
		const longDescription = 'B'.repeat(500);
		const propsWithLongDescription = { ...mockArticle, description: longDescription };
		const { container } = render(ArticleCard, { props: propsWithLongDescription });
		const descriptionElement = container.querySelector('.card-description');
		expect(descriptionElement).toBeTruthy();
		expect(descriptionElement?.textContent).toBe(longDescription);
	});
});
