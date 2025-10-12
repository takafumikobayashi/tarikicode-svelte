# 他力code (tarikicode-svelte)

SvelteKit で構築した個人ポートフォリオサイト「他力code(tariki-code)」のソースコードです。クリエイター Takafumi Kobayashi が取り組むプロジェクト、ブログ、SNS 発信を一体的に紹介することを目的とし、「一緒に創る、明日のためのcode。」というコンセプトで運営しています。

## サイト概要

- ホームヒーローセクションで 3 枚のビジュアルをスライド表示
- プロフィール、Works、Pickup Articles、Recent Post (X/Twitter 埋め込み) などを掲載
- Markdown ベースのブログ機能 (`/blog`) を提供
    - カテゴリ・タグによる絞り込み機能
    - ページネーション対応（12件/ページ）
    - Mermaid 図のサポート
    - 個別記事ページ (`/blog/[slug]`) で OGP/Twitter Card に対応
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

3. 環境変数を設定します（オプション）。

```bash
   # .envファイルに以下を追加（必要に応じて）
   # GitHub Personal Access Token（オプション - APIレート制限を60→5000/hourに拡大）
   GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

GitHub Personal Access Tokenの作成方法：

- <https://github.com/settings/tokens> にアクセス
- "Generate new token (classic)" を選択
- Note: 任意の名前（例：tarikicode-api）
- Expiration: 任意の期限
- Scopes: **public_repo のチェックは不要**（publicリポジトリのread-onlyアクセスは認証なしで可能）
- トークンをコピーして `.env` の `GITHUB_TOKEN` に設定

4. 開発サーバーを起動します。

```bash
   npm run dev
```

必要に応じて `npm run dev -- --open` でブラウザを自動起動できます。

## コマンド一覧

### 開発サーバー

- `npm run dev` — ホットリロード付き開発サーバー
- `npm run build` — 本番ビルド生成
- `npm run preview` — ビルド成果物のローカル確認

### 型チェック

- `npm run check` — SvelteKit 同期と型チェック
- `npm run check:watch` — 監視モードで型チェック

### リントと整形

- `npm run lint` — **全体チェック（コード + Markdown）**
- `npm run lint:fix` — **全体自動修正（コード + Markdown）**
- `npm run lint:code` — コードのみチェック（TypeScript/Svelte）
- `npm run lint:code:fix` — コードのみ自動修正
- `npm run lint:md` — Markdown のみチェック（記事品質）
- `npm run fix:md` — Markdown のみ自動修正
- `npm run format` — Prettier による整形

### テスト

- `npm run test` — Vitest 監視モード
- `npm run test:run` — Vitest 実行（CI 用）
- `npm run test:ui` — Vitest UI モード
- `npm run test:coverage` — カバレッジレポート生成

### テーマ

- `npm run prepare` — SMUI テーマ CSS を再生成（Light + Dark）
- `npm run smui-theme-light` — Light テーマのみ生成
- `npm run smui-theme-dark` — Dark テーマのみ生成

## テストと品質管理

### テスト環境

- **Vitest**: JSDOM 環境で動作
- **Testing Library**: `src/tests/setup.ts` で初期化
- **カバレッジ**: `npm run test:coverage` で HTML レポート生成（`coverage/` ディレクトリ）

### コード品質チェック

プロジェクトでは以下のツールで品質を管理しています：

1. **TypeScript** - 型安全性
2. **ESLint** - コード品質（TypeScript/Svelte）
3. **Prettier** - コード整形
4. **markdownlint-cli2** - Markdown 記事の品質管理
5. **Vitest** - ユニットテスト

### 推奨ワークフロー

#### 記事執筆時

```bash
npm run fix:md      # Markdown自動修正
npm run lint:md     # 記事品質チェック
```

#### コミット前

```bash
npm run lint:fix    # 全体自動修正
npm run test:run    # テスト実行
npm run check       # 型チェック
```

#### CI/CD

`npm run lint` と `npm run check` を CI の品質ゲートとして利用します。

## テーマとアセット

### SMUI テーマ

SMUI トークンは `src/theme/` に配置され、`npm run prepare` で Light/Dark 両テーマの CSS を `static/` に出力します。

### 静的アセット

- **画像**: CloudFront CDN（`https://d1mt09hgbl7gpz.cloudfront.net`）から配信
- **設定**: `src/lib/AppConfig.ts` で画像 URL を管理
- **プリロード**: 重要な画像は `<link rel="preload">` で事前読み込み

### Recent Post（最新ツイート）の更新

トップページの「Recent Post」セクションに表示される最新3件のツイートは、`static/recent-tweets.json` で管理しています。

#### 更新方法（PC）

1. `static/recent-tweets.json` を編集
2. `tweets` 配列に最新3件のツイートURLを記載（新しい順）
3. コミット＆プッシュ → Netlify が自動デプロイ

#### 更新方法（スマホ）

**GitHub Mobile アプリを使用**（推奨）

1. GitHub Mobile アプリをインストール
2. リポジトリを開く
3. `static/recent-tweets.json` を編集
4. Commit & Push → Netlify が自動デプロイ

**ブラウザから更新**:

1. GitHub.com にアクセス
2. `static/recent-tweets.json` を開く
3. 編集アイコン（鉛筆マーク）をクリック
4. Commit changes

#### JSONファイル形式

```json
{
	"tweets": [
		"https://twitter.com/kobatch_tk/status/ツイートID1",
		"https://twitter.com/kobatch_tk/status/ツイートID2",
		"https://twitter.com/kobatch_tk/status/ツイートID3"
	]
}
```

### Pickup Articles（ピックアップ記事）の更新

トップページの「Pickup Articles」セクションに表示される外部記事は、`static/pickup-articles.json` で管理しています。

#### OGP自動取得機能

記事のURLを追加すると、サーバーサイドで自動的にOGP（Open Graph Protocol）メタデータを取得し、以下の情報をカード形式で表示します：

- タイトル（`og:title` または `<title>`タグ）
- 説明文（`og:description` または `<meta name="description">`）
- サムネイル画像（`og:image`）
- サイト名（`og:site_name` またはドメイン名）

#### 更新方法

Recent Postと同様に、PC・スマホのどちらからでも更新可能です。

**JSONファイル形式**:

```json
{
	"articles": [
		{ "url": "https://example.com/article1" },
		{ "url": "https://example.com/article2" }
	]
}
```

#### 技術仕様

- **APIエンドポイント**: `/api/ogp` - OGPメタデータ取得
- **対応サイト**: OGPタグを実装している全てのWebサイト
- **フォールバック**: OGPタグがない場合は通常のHTMLメタタグから取得
- **レスポンシブ対応**: PCでは2カラム、モバイルでは1カラム表示

### New Release（新着情報）のモバイル対応

「New Release」セクションは、デバイスに応じて表示形式が切り替わります：

- **PC（768px以上）**: テーブル形式で表示
- **モバイル（768px以下）**: カード形式で表示（ダークモード対応）

### ブログ記事の管理

ブログ機能は Markdown ファイルで記事を管理します。

#### 記事の追加方法

1. テンプレートをコピー:

   ```bash
   cp src/posts/TEMPLATE.txt src/posts/YYYY-MM-DD-your-article-title.md
   ```

2. ファイル名は `YYYY-MM-DD-slug.md` 形式（例：`2025-01-25-api-design-patterns.md`）
3. フロントマター（YAML 形式）で記事メタデータを編集
4. 記事本文を Markdown で記述

#### フロントマターの構造

```yaml
---
title: '記事タイトル'              # 必須: 記事のタイトル
date: '2025-01-25'                # 必須: 公開日（YYYY-MM-DD形式）
category: 'カテゴリ名'             # 必須: カテゴリ（例: 開発, デザイン, ビジネス）
tags: ['タグ1', 'タグ2', 'タグ3']  # 必須: タグの配列
description: '記事の説明文'        # 必須: OGP/Twitter Card用（100-160文字推奨）
image: 'https://example.com/image.png'  # 必須: OGP画像URL（1200x630px推奨）
featured: false                   # オプション: トップページに注目記事として表示（true/false）
type: 'blog'                      # 必須: 'blog'（ブログ記事）または 'work'（制作実績）
---
```

**各フィールドの説明**:

- **title**: 記事のタイトル。SEO とページタイトルに使用
- **date**: 記事の公開日。ファイル名の日付と一致させることを推奨
- **category**: カテゴリフィルターで使用。既存カテゴリ（開発、デザイン、ビジネスなど）との統一を推奨
- **tags**: タグフィルターで使用。複数指定可能（3-5個程度を推奨）
- **description**: SNS シェア時の説明文。簡潔で魅力的な文章を推奨（100-160文字）
- **image**: 記事のヒーロー画像と OGP 画像。CloudFront URL を推奨（1200x630px）
- **featured**: `true` にするとトップページの「注目記事」に表示される
- **type**: `'blog'` でブログ一覧、`'work'` でトップページの Works に表示

#### 記事の種類

- **blog**: ブログ記事（`/blog` ページに表示）
- **work**: 制作実績（`/` トップページの Works セクションに表示）

#### Mermaid 図の使用

記事内で Mermaid 図を使用できます：

````markdown
```mermaid
graph LR
    A[Start] --> B[Process]
    B --> C[End]
```
````

サポートされている図の種類：

- グラフ（graph）
- シーケンス図（sequenceDiagram）
- フローチャート（flowchart）
- クラス図（classDiagram）
- その他 Mermaid がサポートする全ての図

#### ブログ記事の機能

- **カテゴリフィルター**: セレクトボックスでカテゴリ別に絞り込み
- **タグフィルター**: タグチップをクリックしてタグ別に絞り込み
- **ページネーション**: 12件/ページで自動分割
- **ライト/ダークモード対応**: 自動的にテーマに追従
- **OGP対応**: 各記事で個別の OGP 画像とメタデータを設定可能

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
