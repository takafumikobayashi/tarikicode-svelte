import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
	// グローバル設定
	js.configs.recommended,
	prettierConfig,
	{
		ignores: [
			'.svelte-kit/**',
			'build/**',
			'package/**',
			'node_modules/**',
			'static/**',
			'**/*.config.js',
			'**/*.config.ts',
			'coverage/**'
		]
	},
	// TypeScriptファイル用の設定
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte']
			},
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		plugins: {
			'@typescript-eslint': tsPlugin
		},
		rules: {
			...tsPlugin.configs.recommended.rules,
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'@typescript-eslint/no-explicit-any': 'warn',
			'no-console': ['warn', { allow: ['warn', 'error'] }]
		}
	},
	// Svelteファイル用の設定
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsParser,
				project: './tsconfig.json',
				extraFileExtensions: ['.svelte']
			},
			globals: {
				...globals.browser
			}
		},
		plugins: {
			svelte: sveltePlugin
		},
		rules: {
			...sveltePlugin.configs.recommended.rules,
			'svelte/no-at-html-tags': 'off',
			'svelte/valid-compile': 'error',
			'svelte/no-unused-svelte-ignore': 'warn',
			'no-useless-escape': 'off'
		}
	},
	// JavaScriptファイル用の設定
	{
		files: ['**/*.js'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2021
			}
		},
		rules: {
			'no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_'
				}
			],
			'no-console': ['warn', { allow: ['warn', 'error'] }]
		}
	}
];
