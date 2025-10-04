import { describe, it, expect } from 'vitest';
import { AppConfig } from './AppConfig';

describe('AppConfig', () => {
	describe('Basic Configuration', () => {
		it('should have correct site_name', () => {
			expect(AppConfig.site_name).toBe('tariki-code.tokyo');
		});

		it('should have correct title', () => {
			expect(AppConfig.title).toBe('他力code(tariki-code)');
		});

		it('should have correct description', () => {
			expect(AppConfig.description).toBe('一緒に創る、明日のためのcode。');
		});

		it('should have correct url', () => {
			expect(AppConfig.url).toBe('https://tariki-code.tokyo');
		});

		it('should have correct locale', () => {
			expect(AppConfig.locale).toBe('ja');
		});

		it('should have correct author', () => {
			expect(AppConfig.author).toBe('Takafumi Kobayashi');
		});

		it('should have correct copyright', () => {
			expect(AppConfig.copyright).toBe('©tariki-code All Rights Reserved');
		});

		it('should have correct X account', () => {
			expect(AppConfig.xaccuont).toBe('@kobatch_tk');
		});
	});

	describe('Contacts Configuration', () => {
		it('should have valid email format', () => {
			expect(AppConfig.contacts.email).toMatch(/^mailto:/);
			expect(AppConfig.contacts.email).toBe('mailto:takabumi.k@gmail.com');
		});

		it('should have valid Facebook URL', () => {
			expect(AppConfig.contacts.facebook).toMatch(/^https:\/\//);
			expect(AppConfig.contacts.facebook).toBe(
				'https://www.facebook.com/takafumi.kobayashi.75'
			);
		});

		it('should have valid Twitter URL', () => {
			expect(AppConfig.contacts.twitter).toMatch(/^https:\/\//);
			expect(AppConfig.contacts.twitter).toBe('https://www.twitter.com/kobatch_tk');
		});

		it('should have valid GitHub URL', () => {
			expect(AppConfig.contacts.github).toMatch(/^https:\/\//);
			expect(AppConfig.contacts.github).toBe('https://github.com/takafumikobayashi');
		});

		it('should have valid LinkedIn URL', () => {
			expect(AppConfig.contacts.linkedin).toMatch(/^https:\/\//);
			expect(AppConfig.contacts.linkedin).toBe('https://www.linkedin.com/in/tariki-code/');
		});

		it('should have valid Instagram URL', () => {
			expect(AppConfig.contacts.instagram).toMatch(/^https:\/\//);
			expect(AppConfig.contacts.instagram).toBe('https://www.instagram.com/vertrek_kyoto/');
		});

		it('should have all required contact methods', () => {
			expect(AppConfig.contacts).toHaveProperty('email');
			expect(AppConfig.contacts).toHaveProperty('facebook');
			expect(AppConfig.contacts).toHaveProperty('twitter');
			expect(AppConfig.contacts).toHaveProperty('github');
			expect(AppConfig.contacts).toHaveProperty('linkedin');
			expect(AppConfig.contacts).toHaveProperty('instagram');
		});
	});

	describe('Hero Image Configuration', () => {
		it('should have 3 hero images', () => {
			expect(AppConfig.heroimage).toHaveLength(3);
		});

		it('should have valid image paths', () => {
			AppConfig.heroimage.forEach((hero) => {
				expect(hero.image).toMatch(/\/imgs\//);
				expect(hero.image).toMatch(/\.png$/);
			});
		});

		it('should have descriptions for all hero images', () => {
			AppConfig.heroimage.forEach((hero) => {
				expect(hero.descpiption).toBeTruthy();
				expect(typeof hero.descpiption).toBe('string');
			});
		});

		it('should have details for all hero images', () => {
			AppConfig.heroimage.forEach((hero) => {
				expect(hero.details).toBeTruthy();
				expect(typeof hero.details).toBe('string');
			});
		});

		it('should have correct first hero image content', () => {
			expect(AppConfig.heroimage[0].image).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/imgs/heroimage1.png'
			);
			expect(AppConfig.heroimage[0].descpiption).toBe('一緒に創る、明日のためのcode');
		});
	});

	describe('Post String Configuration', () => {
		it('should have mappings for all blog post types', () => {
			expect(AppConfig.post_string).toHaveProperty('about');
			expect(AppConfig.post_string).toHaveProperty('thanks-card');
			expect(AppConfig.post_string).toHaveProperty('kintone-plugin');
			expect(AppConfig.post_string).toHaveProperty('svelte');
			expect(AppConfig.post_string).toHaveProperty('sns-promotion');
			expect(AppConfig.post_string).toHaveProperty('ai');
			expect(AppConfig.post_string).toHaveProperty('project-management');
		});

		it('should have valid image paths for post strings', () => {
			Object.values(AppConfig.post_string).forEach((imagePath) => {
				expect(imagePath).toMatch(/\.(png|jpg|jpeg)$/);
			});
		});

		it('should map correct images to posts', () => {
			expect(AppConfig.post_string['about']).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/imgs/heroimage1.png'
			);
			expect(AppConfig.post_string['thanks-card']).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/public/thankscard.png'
			);
			expect(AppConfig.post_string['kintone-plugin']).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/public/kintone.png'
			);
			expect(AppConfig.post_string['svelte']).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/public/sveltegirl.png'
			);
			expect(AppConfig.post_string['sns-promotion']).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/public/snspromotion.png'
			);
			expect(AppConfig.post_string['ai']).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/public/ai.png'
			);
			expect(AppConfig.post_string['project-management']).toBe(
				'https://d1mt09hgbl7gpz.cloudfront.net/public/projectmanagement.png'
			);
		});
	});
});
