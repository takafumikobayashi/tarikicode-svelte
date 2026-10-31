import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type Plugin } from 'vite';

/**
 * 記事（src/posts/**\/*.md）を保存したら、開発中のブラウザを再読み込みする。
 * 記事はサーバー側（+page.server.ts の import.meta.glob）でしか読み込まれない。
 * Vite 6以降はクライアントとSSRでモジュールグラフが分かれたため、SSR専用のファイルが
 * 変わってもブラウザには何も通知されない（Vite 5では自動でフルリロードされていた）。
 */
function reloadOnPostChange(): Plugin {
	return {
		name: 'reload-on-post-change',
		apply: 'serve',
		hotUpdate({ file, server }) {
			// hotUpdateは環境ごとに呼ばれるので、SSR側の1回だけで通知する
			if (this.environment.name !== 'ssr') return;
			if (!/\/src\/posts\/.+\.md$/.test(file)) return;
			server.environments.client.hot.send({ type: 'full-reload' });
		}
	};
}

export default defineConfig({
	plugins: [
		reloadOnPostChange(),
		sveltekit({
			// Consult https://kit.svelte.dev/docs/integrations#preprocessors
			// for more information about preprocessors
			preprocess: vitePreprocess(),

			// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
			// If your environment is not supported or you settled on a specific environment, switch out the adapter.
			// See https://kit.svelte.dev/docs/adapters for more information about adapters.
			adapter: adapter()
		})
	],
	build: { rollupOptions: { external: ['fs'] } }
});
