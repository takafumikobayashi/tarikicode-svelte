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

## バージョン管理（jj）

このプロジェクトでは **jj (Jujutsu VCS)** をバージョン管理システムとして使用しています。jjはGitと共存でき、より直感的な操作が可能です。

### jjのインストール

```bash
# macOS (Homebrew)
brew install jj

# その他のプラットフォーム
# https://martinvonz.github.io/jj/latest/install-and-setup/
```

### 基本的なワークフロー

このプロジェクトでは `develop` ブックマーク（≒Gitブランチ）で開発を行います。

#### 状態確認

```bash
# 現在の状態を確認
jj status

# コミット履歴を確認
jj log -n 5

# ブックマーク一覧を確認
jj bookmark list
```

#### 開発作業

```bash
# 新しい変更を開始（自動的に新しいコミットが作成される）
jj new

# 変更内容を記述
jj describe -m "feat: 新機能の追加"

# developブックマークを現在位置に移動（推奨）
jj bookmark set develop
```

#### リモートとの同期

```bash
# リモートから最新を取得
jj git fetch

# ローカルの変更をリモートにプッシュ
jj git push
```

### Cursorエディタとの連携

Cursorでは、コミットハッシュ（例：`42baed1f`）で表示される場合があります。ブックマーク名で表示したい場合は、以下を実行してください：

```bash
# developブックマークを現在のコミットに移動
jj bookmark set develop
```

これにより、Cursorでも `develop` として認識されるようになります。

### jjとGitの関係

- jjは内部的にGitリポジトリを使用
- `.jj/` ディレクトリにjj固有のデータを保存
- GitHubとの連携は `jj git push/fetch` コマンドで可能
- Gitコマンドとjjコマンドは混在可能（非推奨）

### よく使うコマンド早見表

| コマンド                   | 説明                         |
| -------------------------- | ---------------------------- |
| `jj status`                | 現在の状態を確認             |
| `jj log -n 5`              | 最新5件のコミットログを表示  |
| `jj bookmark list`         | ブックマーク一覧を表示       |
| `jj bookmark set <name>`   | ブックマークを現在位置に移動 |
| `jj new`                   | 新しい変更を開始             |
| `jj describe -m "message"` | コミットメッセージを設定     |
| `jj git push`              | リモートへプッシュ           |
| `jj git fetch`             | リモートからフェッチ         |
| `jj diff`                  | 変更内容を確認               |

詳細は [jj公式ドキュメント](https://martinvonz.github.io/jj/latest/) を参照してください。

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

## セキュリティ

本プロジェクトでは、以下のセキュリティ対策を実装しています。

### 1. XSS対策 (Markdownレンダリング)

Markdown記事のHTML変換時に `isomorphic-dompurify` によるサニタイズ処理を行っています。
既存のコンテンツ表示を維持しつつ安全性を確保するため、許可リスト方式を採用しています。

- **許可タグ:** `iframe`, `script`, `ogp-card`, `blockquote`, `chatgpt-go-map` など
- **許可属性:** `target`, `allow`, `allowfullscreen`, `data-url`, `charset`, `async`, `class`, `id`, `style`、SVG属性（`x`, `y`, `fill`, `stroke`等） 等
- **ドメイン制限:** `iframe` と `script` の `src` 属性に対し、信頼できるドメイン（YouTube, Twitter, Instagram, Note, SpeakerDeck等）のみを許可する厳格なフィルターを適用
- **インラインスクリプトブロック:** `src`属性を持たない`<script>`タグは自動削除（XSS対策）
- **srcdoc iframeブロック:** `src`属性を持たない`<iframe>`タグは自動削除（XSS対策）

### 2. SSRF対策 (OGP取得API)

`/api/ogp` エンドポイントでは、URLパラメータに対して以下の検証を行っています。

- プロトコル制限 (`http:` / `https:` のみ許可)
- ローカルネットワーク（localhost, プライベートIP等）へのアクセス拒否

### 3. HTTPセキュリティヘッダー

`src/hooks.server.ts` により、以下のセキュリティヘッダーを全レスポンスに付与しています。

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security` (本番環境のみ有効)

## テーマとアセット

### SMUI テーマ

SMUI トークンは `src/theme/` に配置され、`npm run prepare` で Light/Dark 両テーマの CSS を `static/` に出力します。

### 静的アセット

- **画像**: CloudFront CDN（`https://d1mt09hgbl7gpz.cloudfront.net`）から配信
- **設定**: `src/lib/AppConfig.ts` で画像 URL を一元管理
- **プリロード**: 重要な画像は `<link rel="preload">` で事前読み込み

#### 画像URLの一元管理

すべての画像URLは `src/lib/AppConfig.ts` の `post_string` オブジェクトで管理されています。これにより、画像を変更する際は1箇所を更新するだけで、以下のすべての場所に反映されます：

- トップページの Works カード
- ブログ記事のタイトル画像
- OGP/Twitter Card の画像

**画像変更の手順**:

1. 新しい画像をCloudFrontにアップロード（推奨サイズ: 1200x630px JPEG）
2. `src/lib/AppConfig.ts` の `post_string` を更新

```typescript
post_string: {
  'thanks-card': 'https://d1mt09hgbl7gpz.cloudfront.net/public/thankscard.jpg',
  'kintone-plugin': 'https://d1mt09hgbl7gpz.cloudfront.net/public/kintone.jpg',
  // ... その他の記事
}
```

3. マークダウンファイルの `image` フィールドは不要（自動的にAppConfigから取得）

#### OGP画像の推奨仕様

- **形式**: JPEG（PNGより約25%軽量）
- **サイズ**: 1200x630px（Twitter Card `summary_large_image` の推奨サイズ）
- **アスペクト比**: 1.91:1（横長）
- **最大ファイルサイズ**: 5MB以下

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
title: '記事タイトル' # 必須: 記事のタイトル
date: '2025-01-25' # 必須: 公開日（YYYY-MM-DD形式）
category: 'カテゴリ名' # 必須: カテゴリ（例: 開発, デザイン, ビジネス）
tags: ['タグ1', 'タグ2', 'タグ3'] # 必須: タグの配列
description: '記事の説明文' # 必須: OGP/Twitter Card用（100-160文字推奨）
image: 'https://example.com/image.png' # オプション: 個別にOGP画像を指定（省略時はAppConfigから取得）
featured: false # オプション: トップページに注目記事として表示（true/false）
type: 'blog' # 必須: 'blog'（ブログ記事）または 'work'（制作実績）
---
```

**各フィールドの説明**:

- **title**: 記事のタイトル。SEO とページタイトルに使用
- **date**: 記事の公開日。ファイル名の日付と一致させることを推奨
- **category**: カテゴリフィルターで使用。既存カテゴリ（開発、デザイン、ビジネスなど）との統一を推奨
- **tags**: タグフィルターで使用。複数指定可能（3-5個程度を推奨）
- **description**: SNS シェア時の説明文。簡潔で魅力的な文章を推奨（100-160文字）
- **image**: （オプション）記事のヒーロー画像とOGP画像を個別に指定。省略した場合は `AppConfig.ts` の `post_string[slug]` から自動取得
- **featured**: `true` にするとトップページの「注目記事」に表示される
- **type**: `'blog'` でブログ一覧、`'work'` でトップページの Works に表示

**画像管理の仕組み**:

記事の画像URLは以下の優先順位で決定されます：

1. マークダウンの `image` フィールド（指定されている場合）
2. `AppConfig.ts` の `post_string[slug]`（記事のslugをキーとして取得）
3. 空文字列（画像なし）

これにより、ほとんどの記事では `image` フィールドを省略でき、`AppConfig.ts` で一元管理できます。個別に異なる画像を使いたい場合のみ `image` フィールドを指定してください。

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

#### OGPカード機能（リンクプレビュー）

記事内で外部サイトをリッチなカード形式で表示できます。`[[ogp:URL]]` という記法を使うだけで、自動的に外部サイトのOGP情報（タイトル、説明、画像、サイト名）を取得して表示します。

**使用例**:

```markdown
## 参考リンク

公式ドキュメント：
[[ogp:https://svelte.dev/]]

SvelteKitの詳細：
[[ogp:https://kit.svelte.dev/]]
```

**機能**:

- **自動取得**: OGPメタタグから情報を自動取得
- **レスポンシブ**: PC（横並び）、モバイル（縦並び）に対応
- **インタラクティブ**: ホバー時にプライマリーカラーのボーダー表示
- **エラー処理**: OGP取得失敗時は通常のリンクとして表示
- **キャッシュ**: APIレベルで1時間キャッシュしてパフォーマンス向上

**技術仕様**:

- **APIエンドポイント**: `/api/ogp` - サーバーサイドでOGP情報を取得
- **対応形式**: `property="og:xxx"` および `name="og:xxx"` の両方に対応
- **フォールバック**: OGPタグがない場合は `<title>` や `<meta name="description">` から取得

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
