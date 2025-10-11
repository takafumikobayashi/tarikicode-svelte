import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// オプショナルな環境変数（ビルド時に存在しない場合はundefinedになる）
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const GITHUB_USERNAME = 'takafumikobayashi';
const GITHUB_API_URL = 'https://api.github.com';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間

// キャッシュ用変数
let cachedData: {
	repos: Array<{
		name: string;
		full_name: string;
		description: string;
		html_url: string;
		language: string;
		stargazers_count: number;
		forks_count: number;
		updated_at: string;
		topics: string[];
		homepage: string | null;
	}>;
	username: string;
} | null = null;
let cacheTimestamp = 0;

export const GET: RequestHandler = async () => {
	try {
		// キャッシュが有効かチェック
		const now = Date.now();
		if (cachedData && now - cacheTimestamp < CACHE_DURATION) {
			return json(cachedData);
		}

		// GitHubリポジトリ情報を取得
		const headers: HeadersInit = {
			Accept: 'application/vnd.github.v3+json',
			'User-Agent': 'tariki-code-portfolio'
		};

		// Personal Access Tokenがあれば使用（オプション）
		if (GITHUB_TOKEN) {
			headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
		}

		const reposResponse = await fetch(
			`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
			{ headers }
		);

		if (!reposResponse.ok) {
			return json(
				{ error: 'Failed to fetch repositories' },
				{ status: reposResponse.status }
			);
		}

		const repos = (await reposResponse.json()) as Array<{
			name: string;
			full_name: string;
			description: string;
			html_url: string;
			language: string;
			stargazers_count: number;
			forks_count: number;
			updated_at: string;
			topics?: string[];
			homepage?: string | null;
		}>;

		// 必要な情報のみ抽出
		const formattedRepos = repos.map((repo) => ({
			name: repo.name,
			full_name: repo.full_name,
			description: repo.description,
			html_url: repo.html_url,
			language: repo.language,
			stargazers_count: repo.stargazers_count,
			forks_count: repo.forks_count,
			updated_at: repo.updated_at,
			topics: repo.topics || [],
			homepage: repo.homepage ?? null
		}));

		const responseData = {
			repos: formattedRepos,
			username: GITHUB_USERNAME
		};

		// キャッシュを更新
		cachedData = responseData;
		cacheTimestamp = now;

		return json(responseData);
	} catch (error) {
		console.error('GitHub API error:', error);
		return json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
	}
};
