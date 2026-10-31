import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	test: {
		globals: true,
		environment: 'happy-dom',
		setupFiles: ['./src/tests/setup.ts'],
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['src/routes/**/+*.test.{js,ts}', 'node_modules/**', '.svelte-kit/**'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/tests/',
				'**/*.d.ts',
				'**/*.config.*',
				'**/mockData',
				'.svelte-kit/**'
			]
		}
	},
	resolve: {
		// テスト時はブラウザ版のSvelteを解決する。
		// これがないとSSRビルドが使われ、onMount等のライフサイクルが発火しない
		conditions: process.env.VITEST ? ['browser'] : []
		// $libエイリアスはSvelteKit 3で廃止。#libはpackage.jsonのimportsで解決される
	}
});
