# tarikicode-svelte プロジェクト概要

## プロジェクトについて

「他力code(tariki-code)」は、技術を通じて未来を築くことを目的とした個人ポートフォリオサイトです。SvelteKitを使用して構築されており、記事投稿、作品紹介、SNS連携などの機能を提供しています。

- **サイト名**: 他力code(tariki-code)
- **URL**: https://tariki-code.tokyo
- **著者**: Takafumi Kobayashi
- **コンセプト**: 「一緒に創る、明日のためのcode。」

## 技術スタック

### フレームワーク・ライブラリ

- **SvelteKit**: メインフレームワーク
- **Svelte 4**: UIコンポーネント
- **Vite**: ビルドツール
- **TypeScript**: 型安全な開発

### UIライブラリ

- **SMUI (Svelte Material UI)**: Material Designコンポーネント
    - Button, Card, Data Table, Dialog, Icon Button, Layout Grid, Menu, Paper, Tab, TextField など
- **Swiper**: スライダー/カルーセル
- **Iconify**: アイコン（Logos, IC, CIB）

### マークダウン・コードハイライト

- **marked**: Markdownパーサー
- **highlight.js**: シンタックスハイライト（atom-one-darkテーマ）
- **mermaid**: ダイアグラム生成

### デプロイ

- **Vercel**: ホスティングプラットフォーム（adapter-vercel使用）

## プロジェクト構造

```
tarikicode-svelte/
├── src/
│   ├── lib/                    # 再利用可能なコンポーネント
│   │   ├── AppConfig.ts        # アプリケーション設定
│   │   ├── CommonFunction.ts   # 共通関数（ナビゲーション等）
│   │   ├── Header.svelte       # ヘッダーコンポーネント
│   │   ├── Footer.svelte       # フッターコンポーネント
│   │   ├── HeroImage.svelte    # ヒーローイメージ
│   │   ├── Card.svelte         # Works表示カード
│   │   ├── Articles.svelte     # ピックアップ記事
│   │   ├── RecentPost.svelte   # 最近の投稿（Twitter埋め込み）
│   │   ├── NewRelease.svelte   # 新着情報テーブル
│   │   ├── AboutMe.svelte      # 自己紹介
│   │   ├── Contacts.svelte     # お問い合わせ
│   │   ├── Sns.svelte          # SNSリンク
│   │   ├── ThemeButton.svelte  # テーマ切り替えボタン
│   │   ├── ContentImage.svelte # ブログコンテンツ画像
│   │   ├── PostFooter.svelte   # 投稿フッター
│   │   ├── Profile.svelte      # プロフィール
│   │   ├── Works.svelte        # 作品一覧
│   │   ├── Favorites.svelte    # お気に入り
│   │   ├── PrivacyPolicy.svelte # プライバシーポリシー
│   │   ├── Mermaid.ts          # Mermaidダイアグラム処理
│   │   └── index.ts            # ライブラリエクスポート
│   ├── routes/                 # ルーティング
│   │   ├── +layout.svelte      # レイアウト
│   │   ├── +page.svelte        # ホームページ
│   │   ├── about/              # Aboutページ
│   │   │   └── +page.svelte
│   │   └── blog/               # ブログ
│   │       └── [slug]/         # 動的ルート
│   │           ├── +page.svelte        # ブログ記事表示
│   │           └── +page.server.ts     # サーバーサイドローダー
│   ├── posts/                  # Markdownブログ記事
│   │   ├── ai.md
│   │   ├── kintone-plugin.md
│   │   ├── project-management.md
│   │   ├── sns-promotion.md
│   │   ├── svelte.md
│   │   └── thanks-card.md
│   ├── theme/                  # SMUIテーマ設定
│   └── app.d.ts                # 型定義
├── static/                     # 静的ファイル
│   ├── imgs/                   # 画像
│   ├── public/                 # 公開アセット
│   └── icon/                   # アイコン
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.js
```

## 主要機能

### 1. ホームページ (`/`)

- ヒーローイメージスライダー（3つのコンセプト画像）
- AboutMe セクション
- New Release セクション（最新情報テーブル）
- Works セクション（仕事の紹介）
- Pickup Articles セクション
- Recent Post セクション（Twitter埋め込み）
- Contacts & SNS セクション

### 2. ブログシステム (`/blog/[slug]`)

- Markdownファイルベースのブログ
- サーバーサイドでMarkdownをHTMLに変換（`marked`使用）
- シンタックスハイライト（`highlight.js`）
- OGP/Twitter Card対応
- 動的ルーティング（slug-based）

**ブログ記事一覧**:

- AI活用
- Kintoneプラグイン開発
- プロジェクト管理
- SNSプロモーション
- Svelte開発
- サンキューカード

### 3. テーマ切り替え

- ライト/ダークモード対応
- SMUI用に2つのテーマCSS生成
    - `static/smui.css` (ライト)
    - `static/smui-dark.css` (ダーク)

### 4. SEO対策

- Open Graphメタタグ
- Twitter Cardメタタグ
- 記事ごとの動的OGP画像設定

## 設定ファイル (`AppConfig.ts`)

```typescript
export const AppConfig = {
  site_name: 'tariki-code.tokyo',
  title: '他力code(tariki-code)',
  description: '一緒に創る、明日のためのcode。',
  url: 'https://tariki-code.tokyo',
  locale: 'ja',
  author: 'Takafumi Kobayashi',
  copyright: '©tariki-code All Rights Reserved',
  xaccuont: '@kobatch_tk',
  contacts: { ... },
  heroimage: [ ... ],
  post_string: { ... }
};
```

## 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview

# 型チェック
npm run check
npm run check:watch

# テーマコンパイル
npm run prepare              # ライト & ダークテーマ両方
npm run smui-theme-light     # ライトテーマのみ
npm run smui-theme-dark      # ダークテーマのみ
```

## ナビゲーションシステム

`CommonFunction.ts`に各ページへのナビゲーション関数が定義されています：

- **コンテンツリンク**: `homeLink()`, `aboutLink()`, `thanksCardLink()`, `kintoneLink()`, etc.
- **SNSリンク**: `mailLink()`, `twitterLink()`, `githubLink()`, `linkedinLink()`, etc.
- **新着情報リンク**: `nr20241026Link()`, etc.

すべて`window.location.href`を使用したクライアントサイドナビゲーションです。

## レスポンシブデザイン

- モバイルファーストアプローチ
- `@media (max-width: 768px)`でモバイル最適化
- SMUIのLayout Gridによる柔軟なレイアウト

## デプロイ

- **プラットフォーム**: Vercel
- **アダプター**: `@sveltejs/adapter-vercel`
- 自動デプロイ（Gitプッシュ時）

## 今後の拡張ポイント

1. **ブログ機能の強化**
    - タグ/カテゴリー機能
    - 検索機能
    - ページネーション

2. **パフォーマンス最適化**
    - 画像の最適化（WebP, lazy loading）
    - コード分割

3. **アクセシビリティ向上**
    - ARIA属性の追加
    - キーボードナビゲーション改善

4. **CMS統合**
    - HeadlessCMSの検討（Contentful, Strapi等）

## 参考リンク

- [SvelteKit Documentation](https://kit.svelte.dev/)
- [SMUI Documentation](https://sveltematerialui.com/)
- [Marked Documentation](https://marked.js.org/)
- [Highlight.js](https://highlightjs.org/)
