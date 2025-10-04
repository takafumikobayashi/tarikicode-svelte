import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/svelte';

// テスト後のクリーンアップ
afterEach(() => {
	cleanup();
});

// グローバルなテスト設定
global.fetch = global.fetch || (() => Promise.resolve({ json: () => Promise.resolve({}) }));
