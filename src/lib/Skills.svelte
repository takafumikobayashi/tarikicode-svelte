<script lang="ts">
	import { lightThemeStore } from '$lib/themeStore';

	let isLightTheme = true;
	$: isLightTheme = $lightThemeStore;

	interface Skill {
		name: string;
		badge: string;
		url?: string;
	}

	interface SkillCategory {
		category: string;
		icon: string;
		skills: Skill[];
	}

	const skillCategories: SkillCategory[] = [
		{
			category: 'Languages',
			icon: '💻',
			skills: [
				{
					name: 'TypeScript',
					badge: 'https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white',
					url: 'https://www.typescriptlang.org/'
				},
				{
					name: 'JavaScript',
					badge: 'https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black',
					url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
				},
				{
					name: 'Python',
					badge: 'https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white',
					url: 'https://www.python.org/'
				},
				{
					name: 'Java',
					badge: 'https://img.shields.io/badge/Java-007396?logo=openjdk&logoColor=white',
					url: 'https://www.java.com/'
				},
				{
					name: 'HTML/CSS',
					badge: 'https://img.shields.io/badge/HTML/CSS-E34F26?logo=html5&logoColor=white',
					url: 'https://developer.mozilla.org/en-US/docs/Web/HTML'
				},
				{
					name: 'SQL',
					badge: 'https://img.shields.io/badge/SQL-4479A1?logo=mysql&logoColor=white'
				}
			]
		},
		{
			category: 'Frameworks & Libraries',
			icon: '🛠️',
			skills: [
				{
					name: 'SvelteKit',
					badge: 'https://img.shields.io/badge/SvelteKit-FF3E00?logo=svelte&logoColor=white',
					url: 'https://kit.svelte.dev/'
				},
				{
					name: 'React',
					badge: 'https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black',
					url: 'https://react.dev/'
				},
				{
					name: 'Vue.js',
					badge: 'https://img.shields.io/badge/Vue.js-4FC08D?logo=vuedotjs&logoColor=white',
					url: 'https://vuejs.org/'
				},
				{
					name: 'Node.js',
					badge: 'https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white',
					url: 'https://nodejs.org/'
				},
				{
					name: 'Express',
					badge: 'https://img.shields.io/badge/Express-000000?logo=express&logoColor=white',
					url: 'https://expressjs.com/'
				},
				{
					name: 'FastAPI',
					badge: 'https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white',
					url: 'https://fastapi.tiangolo.com/'
				}
			]
		},
		{
			category: 'AI & Machine Learning',
			icon: '🤖',
			skills: [
				{
					name: 'ChatGPT',
					badge: 'https://img.shields.io/badge/ChatGPT-74aa9c?logo=openai&logoColor=white',
					url: 'https://openai.com/chatgpt'
				},
				{
					name: 'Claude',
					badge: 'https://img.shields.io/badge/Claude-CC9B7A?logo=anthropic&logoColor=white',
					url: 'https://claude.ai/'
				},
				{
					name: 'GitHub Copilot',
					badge: 'https://img.shields.io/badge/GitHub_Copilot-000000?logo=github&logoColor=white',
					url: 'https://github.com/features/copilot'
				},
				{
					name: 'OpenAI API',
					badge: 'https://img.shields.io/badge/OpenAI_API-412991?logo=openai&logoColor=white',
					url: 'https://platform.openai.com/'
				},
				{
					name: 'LangChain',
					badge: 'https://img.shields.io/badge/LangChain-1C3C3C?logo=chainlink&logoColor=white',
					url: 'https://www.langchain.com/'
				},
				{
					name: 'Hugging Face',
					badge: 'https://img.shields.io/badge/Hugging_Face-FFD21E?logo=huggingface&logoColor=black',
					url: 'https://huggingface.co/'
				}
			]
		},
		{
			category: 'Cloud & DevOps',
			icon: '☁️',
			skills: [
				{
					name: 'AWS',
					badge: 'https://img.shields.io/badge/AWS-232F3E?logo=amazonwebservices&logoColor=white',
					url: 'https://aws.amazon.com/'
				},
				{
					name: 'Azure',
					badge: 'https://img.shields.io/badge/Azure-0078D4?logo=microsoftazure&logoColor=white',
					url: 'https://azure.microsoft.com/'
				},
				{
					name: 'Docker',
					badge: 'https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white',
					url: 'https://www.docker.com/'
				},
				{
					name: 'GitHub Actions',
					badge: 'https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white',
					url: 'https://github.com/features/actions'
				},
				{
					name: 'Netlify',
					badge: 'https://img.shields.io/badge/Netlify-00C7B7?logo=netlify&logoColor=white',
					url: 'https://www.netlify.com/'
				},
				{
					name: 'Heroku',
					badge: 'https://img.shields.io/badge/Heroku-430098?logo=heroku&logoColor=white',
					url: 'https://www.heroku.com/'
				}
			]
		},
		{
			category: 'Low-Code/No-Code',
			icon: '⚡',
			skills: [
				{
					name: 'Power Platform',
					badge: 'https://img.shields.io/badge/Power_Platform-742774?logo=powerapps&logoColor=white',
					url: 'https://www.microsoft.com/en-us/power-platform'
				},
				{
					name: 'Power Apps',
					badge: 'https://img.shields.io/badge/Power_Apps-742774?logo=powerapps&logoColor=white'
				},
				{
					name: 'Power Automate',
					badge: 'https://img.shields.io/badge/Power_Automate-0066FF?logo=powerautomate&logoColor=white'
				},
				{
					name: 'Dataverse',
					badge: 'https://img.shields.io/badge/Dataverse-0078D4?logo=microsoft&logoColor=white'
				}
			]
		},
		{
			category: 'Project Management & Tools',
			icon: '📊',
			skills: [
				{
					name: 'Git',
					badge: 'https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white',
					url: 'https://git-scm.com/'
				},
				{
					name: 'Jira',
					badge: 'https://img.shields.io/badge/Jira-0052CC?logo=jira&logoColor=white',
					url: 'https://www.atlassian.com/software/jira'
				},
				{
					name: 'Asana',
					badge: 'https://img.shields.io/badge/Asana-F06A6A?logo=asana&logoColor=white',
					url: 'https://asana.com/'
				},
				{
					name: 'Confluence',
					badge: 'https://img.shields.io/badge/Confluence-172B4D?logo=confluence&logoColor=white',
					url: 'https://www.atlassian.com/software/confluence'
				},
				{
					name: 'Notion',
					badge: 'https://img.shields.io/badge/Notion-000000?logo=notion&logoColor=white',
					url: 'https://www.notion.so/'
				},
				{
					name: 'Miro',
					badge: 'https://img.shields.io/badge/Miro-050038?logo=miro&logoColor=white',
					url: 'https://miro.com/'
				},
				{
					name: 'Vite',
					badge: 'https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white',
					url: 'https://vitejs.dev/'
				}
			]
		}
	];
</script>

<div class="skills-container">
	<div class="section-header">
		<h2 class="mdc-typography--headline5">Skills & Tech Stack</h2>
		<p class="section-description mdc-typography--body1">Technologies and tools I work with</p>
	</div>

	<div class="skills-grid">
		{#each skillCategories as category}
			<div class="skill-category" class:dark={!isLightTheme}>
				<div class="category-header">
					<span class="category-icon">{category.icon}</span>
					<h3 class="category-title mdc-typography--subtitle1">{category.category}</h3>
				</div>
				<div class="skills-list">
					{#each category.skills as skill}
						{#if skill.url}
							<a
								href={skill.url}
								target="_blank"
								rel="noopener noreferrer"
								class="skill-link"
							>
								<img src={skill.badge} alt={skill.name} class="skill-badge-img" />
							</a>
						{:else}
							<img src={skill.badge} alt={skill.name} class="skill-badge-img" />
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.skills-container {
		padding: 0;
	}

	.section-header {
		margin-bottom: 24px;
	}

	.section-header h2 {
		margin: 0 0 8px 0;
		font-size: 24px;
		font-weight: 600;
	}

	.section-description {
		margin: 0;
		color: #656d76;
		font-size: 14px;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 20px;
	}

	.skill-category {
		background: #f6f8fa;
		border: 1px solid #d0d7de;
		border-radius: 8px;
		padding: 20px;
		transition: all 0.2s ease;
	}

	.skill-category:hover {
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
	}

	.skill-category.dark {
		background: #161b22;
		border-color: #30363d;
	}

	.skill-category.dark:hover {
		box-shadow: 0 2px 8px rgba(255, 255, 255, 0.05);
	}

	.category-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}

	.category-icon {
		font-size: 20px;
	}

	.category-title {
		margin: 0;
		font-size: 16px;
		font-weight: 600;
		color: #24292f;
	}

	.skill-category.dark .category-title {
		color: #c9d1d9;
	}

	.skills-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}

	.skill-link {
		display: inline-block;
		transition: opacity 0.2s ease;
	}

	.skill-link:hover {
		opacity: 0.8;
	}

	.skill-badge-img {
		height: 20px;
		display: inline-block;
		vertical-align: middle;
	}

	@media (max-width: 768px) {
		.section-header h2 {
			font-size: 20px;
		}

		.section-description {
			font-size: 13px;
		}

		.skills-grid {
			grid-template-columns: 1fr;
			gap: 16px;
		}

		.skill-category {
			padding: 16px;
		}

		.category-title {
			font-size: 15px;
		}
	}
</style>
