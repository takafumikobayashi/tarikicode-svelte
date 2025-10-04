import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OpenAI APIクライアントの初期化
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY
});

// 現在の日付を取得してファイル名を生成
const getDateString = () => {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
};

// Web検索を使って最新ニュースを取得
const searchLatestTechNews = async () => {
	const today = new Date().toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	const searchPrompt = `今日は${today}です。以下のテーマに関する最新の技術ニュースやトレンドを検索してください：

- Web開発（特にSvelteKit、TypeScript、フロントエンド技術）
- AI・機械学習の最新動向と実用例
- kintoneやローコード・ノーコード開発
- プロジェクトマネジメントとDX
- 地方創生とテクノロジー活用

過去1週間以内の最新情報を優先的に探してください。`;

	try {
		console.warn('最新の技術ニュースを検索中...');

		const searchResponse = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'user',
					content: searchPrompt
				}
			],
			web_search: {
				enabled: true
			},
			temperature: 0.3
		});

		const searchResults = searchResponse.choices[0].message.content;
		console.warn('検索が完了しました。');

		return searchResults;
	} catch (error) {
		console.error('検索中にエラーが発生しました:', error);
		throw error;
	}
};

// 記事生成のプロンプト
const generatePrompt = (searchResults) => {
	const today = new Date().toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	return `あなたは技術ブログ「他力code(tariki-code)」のライターです。このブログは「一緒に創る、明日のためのcode」をテーマに、技術を通じて未来を築くことを目指しています。

今日は${today}です。以下の最新情報を元に、日本語で技術記事を作成してください。

【検索結果・最新情報】
${searchResults}

記事の要件:
1. Markdown形式で出力
2. タイトルは ## で始める
3. 導入部分で記事の概要を簡潔に説明
4. 本文は3-4つのセクションに分ける
5. 各セクションには #### の見出しを付ける
6. 実用的な情報や具体例を含める
7. 読者にとって有益で実践的な内容にする
8. 文体は丁寧で分かりやすく、専門用語には簡単な説明を加える
9. 記事の長さは1000-1500文字程度
10. 情報源がある場合は、記事の最後に参考リンクを記載する

記事を作成してください。`;
};

// OpenAI APIを使って記事を生成
const generateArticle = async () => {
	try {
		// まず最新ニュースを検索
		const searchResults = await searchLatestTechNews();

		console.warn('記事生成を開始します...');

		const prompt = generatePrompt(searchResults);

		const response = await openai.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content:
						'あなたは技術ブログのプロフェッショナルなライターです。最新の技術トレンドに詳しく、読者にとって有益で実践的な記事を書くことができます。検索結果を元に、正確で分かりやすい記事を作成してください。'
				},
				{
					role: 'user',
					content: prompt
				}
			],
			temperature: 0.7,
			max_tokens: 3000
		});

		const article = response.choices[0].message.content;
		console.warn('記事の生成が完了しました。');

		return article;
	} catch (error) {
		console.error('記事生成中にエラーが発生しました:', error);
		throw error;
	}
};

// 記事をファイルに保存
const saveArticle = async (content) => {
	try {
		const dateString = getDateString();
		const filename = `${dateString}-daily-tech-news.md`;
		const postsDir = path.join(__dirname, '..', 'src', 'posts');
		const filepath = path.join(postsDir, filename);

		// postsディレクトリが存在しない場合は作成
		if (!fs.existsSync(postsDir)) {
			fs.mkdirSync(postsDir, { recursive: true });
		}

		// 同名のファイルが既に存在する場合はエラー
		if (fs.existsSync(filepath)) {
			console.warn(`記事ファイル ${filename} は既に存在します。スキップします。`);
			return { success: false, filename, reason: 'already_exists' };
		}

		fs.writeFileSync(filepath, content, 'utf8');
		console.warn(`記事を保存しました: ${filepath}`);

		return { success: true, filename, filepath };
	} catch (error) {
		console.error('記事の保存中にエラーが発生しました:', error);
		throw error;
	}
};

// メイン処理
const main = async () => {
	try {
		// 環境変数のチェック
		if (!process.env.OPENAI_API_KEY) {
			throw new Error('OPENAI_API_KEY environment variable is not set');
		}

		// 記事生成
		const article = await generateArticle();

		// 記事保存
		const result = await saveArticle(article);

		if (result.success) {
			console.warn('\n✅ 記事の生成と保存が完了しました。');
			console.warn(`ファイル名: ${result.filename}`);
		} else if (result.reason === 'already_exists') {
			console.warn('\n⚠️  本日の記事は既に存在します。');
		}

		process.exit(0);
	} catch (error) {
		console.error('\n❌ エラーが発生しました:', error.message);
		process.exit(1);
	}
};

main();
