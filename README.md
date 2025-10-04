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
- **ホスティング**: Vercel (adapter-vercel)

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

Vercel でのホスティングを想定しています。環境ごとの設定は `vite.config.ts` と `svelte.config.js` のエイリアスやアダプタ設定を更新してください。独自ドメインや環境変数を追加する場合は Vercel ダッシュボードと `.env` 管理を合わせて調整します。

## コントリビューション

開発フロー、コミットメッセージ規約、レビュー手順などは `AGENTS.md` に集約しています。Issues / Pull Requests での議論は原則日本語で行い、必要に応じて概要を英語で補記してください。
