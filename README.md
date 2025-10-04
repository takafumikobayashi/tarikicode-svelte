# 他力code (tarikicode-svelte)

SvelteKit で構築した個人ポートフォリオサイト「他力code(tariki-code)」のソースコードです。クリエイター Takafumi Kobayashi が取り組むプロジェクト、ブログ、SNS 発信を一体的に紹介することを目的とし、「一緒に創る、明日のためのcode。」というコンセプトで運営しています。

## サイト概要

- ホームヒーローセクションで 3 枚のビジュアルをスライド表示
- プロフィール、Works、Pickup Articles、Recent Post (X/Twitter 埋め込み) などを掲載
- Markdown ベースのブログ記事 (`/blog/[slug]`) を提供し、OGP/Twitter Card に対応
- SMUI を利用したライト／ダークテーマを切り替え可能

## 技術スタック

- **フレームワーク**: SvelteKit, Svelte 4, TypeScript
- **UI**: Svelte Material UI (SMUI), Swiper, Iconify
- **Markdown/ハイライト**: marked, highlight.js, mermaid
- **ビルド/ツール**: Vite, Vitest, ESLint, Prettier, svelte-check
- **ホスティング**: Netlify
- **CI/CD**: GitHub Actions

## プロジェクト構成

```bash
tarikicode-svelte/
├── src/
│   ├── lib/          # 再利用コンポーネント・ユーティリティ
│   ├── routes/       # SvelteKit ルート (+page.svelte 等)
│   ├── posts/        # Markdown 記事
│   ├── tests/        # テストヘルパー・統合テスト
│   └── theme/        # SMUI テーマトークン
├── static/           # 公開アセット・テーマ CSS
├── AGENTS.md         # コントリビューションガイドライン
├── CLAUDE.md         # Claude 向け案内 (AGENTS.md 参照)
├── package.json
├── svelte.config.js
├── vite.config.ts
└── vitest.config.ts
```

## セットアップ

1. Node.js 22 系と npm を準備します。
2. 依存をインストールします。

```bash
   npm install
```

3. 開発サーバーを起動します。

```bash
   npm run dev
```

必要に応じて `npm run dev -- --open` でブラウザを自動起動できます。

## コマンド一覧

- `npm run dev` — ホットリロード付き開発サーバー
- `npm run build` — 本番ビルド生成
- `npm run preview` — ビルド成果物のローカル確認
- `npm run check` / `npm run check:watch` — SvelteKit 同期と型チェック
- `npm run lint` / `npm run lint:fix` — Prettier + ESLint の検証と自動修正
- `npm run format` — Prettier による整形
- `npm run test` / `npm run test:run` / `npm run test:coverage` — Vitest の実行
- `npm run prepare` — `src/theme/` から SMUI テーマ CSS を再生成

## テストと品質管理

Vitest は JSDOM 環境で動作し、`src/tests/setup.ts` で Testing Library が初期化されています。重要な変更前には `npm run test:coverage` でカバレッジを確認し、`coverage/` ディレクトリの HTML レポートを確認してください。`npm run lint` と `npm run check` を CI 同等の品質ゲートとして利用します。

## テーマとアセット

SMUI トークンは `src/theme/` に配置され、`npm run smui-theme-light` および `npm run smui-theme-dark` で `static/` に CSS を出力します。画像や OGP 用アセットは `static/` 配下にまとめて配置してください。

## デプロイ

Netlify でのホスティングを想定しています。main ブランチへのプッシュで自動的にデプロイが開始されます。環境ごとの設定は `vite.config.ts` と `svelte.config.js` のエイリアスやアダプタ設定を更新してください。独自ドメインや環境変数を追加する場合は Netlify ダッシュボードと `.env` 管理を合わせて調整します。

### GitHub Secrets の設定

自動記事生成機能を使用するには、以下のシークレットを GitHub リポジトリに設定する必要があります：

1. **OPENAI_API_KEY** (必須)
    - OpenAI API のアクセスキー
    - Settings → Secrets and variables → Actions → New repository secret
    - OpenAI のアカウントから API キーを取得: https://platform.openai.com/api-keys

2. **GITHUB_TOKEN** (自動設定)
    - GitHub Actions が自動的に提供するトークン
    - 手動設定は不要です

### 自動記事生成ワークフロー

GitHub Actions により、毎日午前 9 時（JST）に技術記事が自動生成されます：

- **ワークフロー**: `.github/workflows/daily-article-generator.yml`
- **スクリプト**: `scripts/generate-daily-article.js`
- **実行スケジュール**: 毎日 UTC 0:00（JST 9:00）
- **手動実行**: GitHub の Actions タブから "Daily Article Generator" を選択して実行可能

#### ワークフローの流れ

1. OpenAI のWeb検索機能を使用して最新の技術ニュースを検索
2. 検索結果を元に GPT-4o が技術記事を生成
3. 生成された記事を `src/posts/YYYY-MM-DD-daily-tech-news.md` として保存
4. 自動的に PR を作成（ブランチ名: `daily-article/{run_id}`）
5. PR をレビューして問題なければマージ
6. マージ後、Netlify で自動デプロイ

#### 記事の確認とマージ

自動生成された記事は PR として作成されるため、以下を確認してからマージしてください：

- 記事の内容が適切か
- 文法や表現に問題がないか
- 技術的な情報が正確か
- リンクや画像が正しく機能するか（該当する場合）

## コントリビューション

開発フロー、コミットメッセージ規約、レビュー手順などは `AGENTS.md` に集約しています。Issues / Pull Requests での議論は原則日本語で行い、必要に応じて概要を英語で補記してください。
