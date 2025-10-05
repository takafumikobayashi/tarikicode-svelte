import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const GITHUB_USERNAME = 'takafumikobayashi';
const GITHUB_API_URL = 'https://api.github.com';

export const GET: RequestHandler = async () => {
	try {
		// GitHubリポジトリ情報を取得
		const reposResponse = await fetch(
			`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`,
			{
				headers: {
					Accept: 'application/vnd.github.v3+json',
					'User-Agent': 'tariki-code-portfolio'
				}
			}
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
			homepage?: string;
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
			homepage: repo.homepage
		}));

		return json({
			repos: formattedRepos,
			username: GITHUB_USERNAME
		});
	} catch (error) {
		console.error('GitHub API error:', error);
		return json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
	}
};
