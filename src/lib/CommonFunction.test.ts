import { describe, it, expect, beforeEach } from 'vitest';
import {
	homeLink,
	aboutLink,
	thanksCardLink,
	kintoneLink,
	svelteLink,
	snsPromotionLink,
	aiLink,
	projectManagementLink,
	mailLink,
	twitterLink,
	githubLink,
	linkedinLink,
	facebookLink,
	instagramLink,
	nr20241026Link
} from './CommonFunction';
import { AppConfig } from './AppConfig';

describe('CommonFunction', () => {
	// window.location.hrefのモック
	beforeEach(() => {
		// location.hrefを書き込み可能にする
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		delete (window as any).location;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).location = { href: '' };
	});

	describe('Content Link Functions', () => {
		it('homeLink should navigate to home page', () => {
			homeLink();
			expect(window.location.href).toBe('/');
		});

		it('aboutLink should navigate to about page', () => {
			aboutLink();
			expect(window.location.href).toBe('/about');
		});

		it('thanksCardLink should navigate to thanks-card blog post', () => {
			thanksCardLink();
			expect(window.location.href).toBe('/blog/thanks-card');
		});

		it('kintoneLink should navigate to kintone-plugin blog post', () => {
			kintoneLink();
			expect(window.location.href).toBe('/blog/kintone-plugin');
		});

		it('svelteLink should navigate to svelte blog post', () => {
			svelteLink();
			expect(window.location.href).toBe('/blog/svelte');
		});

		it('snsPromotionLink should navigate to sns-promotion blog post', () => {
			snsPromotionLink();
			expect(window.location.href).toBe('/blog/sns-promotion');
		});

		it('aiLink should navigate to ai blog post', () => {
			aiLink();
			expect(window.location.href).toBe('/blog/ai');
		});

		it('projectManagementLink should navigate to project-management blog post', () => {
			projectManagementLink();
			expect(window.location.href).toBe('/blog/project-management');
		});
	});

	describe('SNS Link Functions', () => {
		it('mailLink should navigate to email address', () => {
			mailLink();
			expect(window.location.href).toBe(AppConfig.contacts.email);
		});

		it('twitterLink should navigate to Twitter profile', () => {
			twitterLink();
			expect(window.location.href).toBe(AppConfig.contacts.twitter);
		});

		it('githubLink should navigate to GitHub profile', () => {
			githubLink();
			expect(window.location.href).toBe(AppConfig.contacts.github);
		});

		it('linkedinLink should navigate to LinkedIn profile', () => {
			linkedinLink();
			expect(window.location.href).toBe(AppConfig.contacts.linkedin);
		});

		it('facebookLink should navigate to Facebook profile', () => {
			facebookLink();
			expect(window.location.href).toBe(AppConfig.contacts.facebook);
		});

		it('instagramLink should navigate to Instagram profile', () => {
			instagramLink();
			expect(window.location.href).toBe(AppConfig.contacts.instagram);
		});
	});

	describe('New Release Link Functions', () => {
		it('nr20241026Link should navigate to kintone-plugin blog post', () => {
			nr20241026Link();
			expect(window.location.href).toBe('/blog/kintone-plugin');
		});
	});
});
