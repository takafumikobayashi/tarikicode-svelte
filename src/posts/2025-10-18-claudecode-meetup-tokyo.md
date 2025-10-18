---
title: 'ClaudeCode Meetup Tokyo備忘メモ'
date: '2025-10-18'
category: 'AI'
tags: ['ClaudeCode', 'jujutsu', 'ccusage']
description: '2025/10/17 Claude Code Meetup Tokyo（会場：メルカリ六本木、YouTube同時配信）。セッション3＋LT6の構成で、実務的な使い方が多数共有されました。'
image: 'https://aiau.connpass.com/event/369265/'
featured: false
type: 'blog'
---

### ClaudeCode Meetup Tokyo備忘メモ

2025/10/17、**Claude Code Meetup Tokyo** （会場：メルカリ六本木、YouTube同時配信）に参加させていただきました！セッション3＋LT6の構成で、実務的な使い方が多数共有されました。こちらはレポートではなく、聞いた内容を自分なりに咀嚼し、あくまで個人的に役立てる備忘として残したものです。ご参考になれば...

[[ogp:https://aiau.connpass.com/event/369265/]]

#### 今日から役立つポイント（超要約）

- **サブエージェントで文脈分離**：レビュー専用・デバッグ専用など役割ごとに独立コンテキストで走らせ、メイン会話の汚染を防ぐ。`/agents` で作成・管理。
- **コンテキスト設計（Context Engineering）**：情報を入れすぎず、中間指示が抜ける _Lost in the Middle_ を回避。要約・クリアをこまめに。
- **出力スタイルの活用**：`/output-style learning|explanatory` で「学びながら書く」「解説重視」に切り替え可能。`TODO(human)` 指示でペアプロ感を作れる。
- **使用量の可視化**：CLIツール **ccusage** で日/週/月・5時間ブロックを即把握。`npx ccusage@latest` が最短。

#### ワークフロー設計のコア

```mermaid
flowchart LR
  A[課題/仕様の明文化] --> B[サブエージェント分割]
  B --> C[最小文脈で対話]
  C --> D[ /review等で安全柵 ]
  D --> E[ ログ/コストの可視化 ccusage]
```

- VSCode＋CLI前提でビルド/テストログを直接フィードバックし、AIが自動修正サイクルを回す設計が有効。レビューは /review ＋ 外部ツールを併用してAIの自己レビュー偏りを避ける。 ￼
- 大規模開発では文脈のダイエットが成否を分ける。指示の粒度・順序を整え、肥大化時は /compact や会話クリアも併用。

#### 重要コマンド速引き（Claude Code）

そのまま端末やインタラクティブ画面で使えるもの

##### ビルトイン（スラッシュ） ￼

- `/agents` サブエージェントの作成・編集・権限設定
- `/review` コードレビューの実行
- `/usage` プラン使用量・レート制限の表示
- `/cost` トークン使用量の統計表示（購読プランに依存）
- `/compact` 会話圧縮、/clear クリア、/init CLAUDE.md 初期化
- `/output-style` Explanatory/Learning への切替

##### CLI/フラグ（非対話モードで便利）

```bash
# 単発問い合わせ（JSONで機械処理しやすく）
claude -p "explain this function" --output-format json

# 直近セッション継続 + 最大ターン制限
claude --continue -p "fix failing tests" --max-turns 3 --verbose
```

##### 出力スタイル（学習/解説モード）

```bash
/output-style learning
/output-style explanatory
/output-style:new I want an output style that writes terse diffs first
```

##### サブエージェント最小レシピ

- 使い方：`/agents` でガイドに従って作成。役割記述に「use proactively」を入れると自動委譲が促進される。 ￼
- CLI一発定義（セッション限定）

```json
claude --agents '{
  "debugger": {
    "description": "Debug specialist. Use proactively on errors.",
    "prompt": "Identify root causes and propose minimal fixes.",
    "tools": ["Read","Grep","Bash","Glob"],
    "model": "inherit"
  }
}'
```

##### 使用量の見える化（ccusage）

- インストール不要で即実行：`npx ccusage@latest`
- 主なビュー：daily / monthly / session、5時間課金枠の `blocks --live` が便利。

```bash
npx ccusage@latest daily --breakdown
npx ccusage@latest blocks --live
```

#### コンテキスト設計の注意点

- 長文の途中指示が忘れられる Lost in the Middle 問題を意識。粒度を絞り、段階実行・要約で中核を保つ。

#### 運用メモ（小ネタ）

- プランの使用上限/週次レート制限には注意（重課金回避・SLA想定）。ヘビーユース時は追加枠や運用設計を。

#### 出典・リンク

[[ogp:https://zenn.dev/truestar/articles/f4707bb745a74b]]
[[ogp:https://docs.claude.com/en/docs/claude-code/slash-commands]]
[[ogp:https://docs.claude.com/en/docs/claude-code/cli-reference]]
[[ogp:https://docs.claude.com/en/docs/claude-code/output-styles]]
[[ogp:https://docs.claude.com/en/docs/claude-code/sub-agents]]
[[ogp:https://ccusage.com/]]
