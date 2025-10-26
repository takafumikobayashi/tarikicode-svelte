---
title: 'スマホ＆クラウドで走らせるClaude Code：最小構成と安全運用Tips'
date: '2025-10-26'
category: '開発'
tags: ['Claude Code', 'モバイル', 'クラウド', 'CLI', '運用']
description: 'iPhoneやブラウザだけでClaude Codeを動かす実践メモ。Web版/CLIの導入、SSH運用、ヘッドレス自動化、権限・ネットワーク設計まで最短パターンを整理。'
image: 'https://www.anthropic.com/news/claude-code-on-the-web'
featured: false
type: 'blog'
---

### スマホ＆クラウドで走らせるClaude Code：最小構成と安全運用Tips

iPhoneやブラウザだけでClaude Codeを動かす実践メモ。Web版/CLIの導入、SSH運用、ヘッドレス自動化、権限・ネットワーク設計まで最短パターンを整理。

#### 何があった？

- **Claude Code on the web** が研究プレビューで公開。GitHub連携・クラウド環境で非同期にタスクを走らせ、iOSアプリからも起動・モニタが可能に。

#### 今日から使うパターン3つ（最短）

##### 1) ブラウザ/スマホだけ（Claude Code on the web）

**こんな時に：**

- PCが手元にない外出先や移動中。
- サクッとバグ修正やレビュー、ドキュメント更新したい。
- GitHub上の軽作業を素早く片付けたい。

**手順：**

1. `claude.ai/code` へ → GitHub連携 → 既定環境を選択。
2. タスク投入 → 変更がブランチに反映 → PR化。
3. 必要なら「Open in CLI」でローカルへ引き継ぎ。

**制約：** 重い処理・複雑なビルド環境が必要な作業には不向き。軽〜中程度のタスク向け。

##### 2) スマホ → SSH/Mosh → リモートVMでCLI

**こんな時に：**

- モバイルから本格的な開発環境にアクセスしたい。
- ローカルマシンのスペックや電力を使いたくない。
- 長時間実行タスク（テスト・ビルド）をリモートで回したい。

**手順：**

- 任意のLinuxサーバにCLI導入 → スマホのSSHクライアントで接続。
- 回線不安定対策に **mosh**、セッション維持に **tmux** を併用。
- 実務は「**リモートに置く／手元は薄く**」が安定。（鍵管理と画面復帰が速い）

**制約：** サーバー準備とコストが必要。ただし環境を完全制御できる。

##### 3) ブラウザIDEで完結（例：Codespaces）

**こんな時に：**

- 一時的な検証環境が欲しい。
- チームで統一された開発環境を即座に共有したい。
- ローカル環境を汚したくない。

**手順：**

- ブラウザのターミナルで `npm install -g @anthropic-ai/claude-code` を導入。
- devcontainer定義で依存を固定し、どこからでも同じ環境で再現。

**制約：** プラットフォーム依存。オフラインでは使えない。

#### 最小セットアップ（CLI）

```bash
# Node 18+ がある場合（推奨）
npm install -g @anthropic-ai/claude-code
# 初回ログイン（REPL起動後）
claude
# セッション内で
/login
```

##### CLIの使い分け：対話 vs 非対話

**対話モード（`claude`）— 探索的な作業向け**

こんな時に：試行錯誤しながらコードを書く、複数ファイルを横断的に調査、リアルタイムでフィードバックが欲しい。

```bash
claude
# → 対話的にやりとりしながら進める
```

**非対話モード（`claude -p`）— 自動化・CI向け**

こんな時に：スクリプトやCI/CDで結果だけ欲しい、決まったタスクを繰り返し実行。

```bash
# 一問一答（結果をJSONで受け取り機械処理）
claude -p "failing testsを直す案を3つ" --output-format json --max-turns 3
```

**継続セッション（`--continue`）— 長期タスクの分割実行**

こんな時に：大きなタスクを複数回に分けて進めたい、前回の文脈を維持したまま追加指示。

```bash
# 前回の続きから
claude --continue -p "さっきの修正を最小差分でコミットして"
```

**サブエージェント定義（`--agents`）— 専門タスクの自動化**

こんな時に：コードレビュー専用、セキュリティチェック専用など、特定目的のエージェントを動かしたい。

```bash
claude --agents '{
  "reviewer": {
    "description": "Proactively review diffs",
    "prompt": "Security & performance first",
    "tools": ["Read","Grep","Bash"],
    "model": "sonnet"
  }
}'
```

##### 安全に回す基本設計

**権限・道具の明示:**

- `--allowedTools` / `--disallowedTools` で実行可能な操作を制限。
- 例：ドキュメント更新のみなら `--allowedTools "Read,Write"` でBashを禁止。
- **なぜ必要？** 意図しないコマンド実行や外部通信を防ぐ。

**暴走防止:**

- `--max-turns` でエージェントのループ回数を制限。
- 長処理は timeout と `--output-format json` で機械監視。
- **なぜ必要？** 無限ループやコスト爆発を防ぐ。

**Web版のネットワーク制御:**

- 既定は制限付き。必要ドメインのみ許可に寄せる。
- **なぜ必要？** 意図しないデータ送信や外部APIコールを制御。

**環境固定:**

- `devcontainer`（Docker）で依存をピン留め。
- **なぜ必要？** "Works on my machine" 問題を回避、再現性確保。

**モバイル運用:**

- mosh + tmux で回線断や画面消灯に強く。
- **なぜ必要？** モバイル回線は不安定。セッション維持で作業継続性を確保。

##### 便利スラッシュコマンド（REPL内）

- `/review` — コードレビュー。（PR前のセルフチェックに）
- `/usage` — 使用量/レート上限の確認。（上限到達前にチェック）
- `/compact` — 会話圧縮。（長い対話で文脈がぼやけてきたら）
- `/agents` — サブエージェントの作成・管理。（専門タスクの定義）
- `/cost` — トークン統計の表示。（コスト管理）
- `/status` — バージョン・モデル・接続状態の確認。
- `/init` — CLAUDE.mdの生成。（プロジェクト初期化）

##### ヘッドレス自動化の雛形（CI/スクリプト）

**こんな時に:**

- GitHub ActionsやGitLab CIでコード品質チェックを自動化。
- 定期的なリファクタリングや依存更新を無人実行。
- 複数リポジトリに同じ修正を一括適用。

**基本パターン：**

```bash
# JSONで結果/コスト/セッションIDを受け取り機械処理
result=$(claude -p "lint & fix" --output-format json --max-turns 3)
echo "$result" | jq -r '.result'

# 権限を絞ってセキュリティ確保
claude -p "README更新" \
  --allowedTools "Read,Write" \
  --disallowedTools "Bash" \
  --max-turns 2
```

##### 小ネタ：スマホ運用の実務Tips

- SSH鍵は端末内に置かず、パスフレーズ＋ハードウェアキー/パスキー運用。
- tmuxの自動復帰。（モバイルは回線断が常）
- ログはJSONLで保存。（タスク名/コスト/所要時間/採用案）

#### 参考ソース

[[ogp:https://docs.claude.com/en/docs/claude-code/claude-code-on-the-web]]
[[ogp:https://docs.claude.com/en/docs/claude-code/quickstart]]
[[ogp:https://docs.claude.com/en/docs/claude-code/cli-reference]]
[[ogp:https://docs.claude.com/en/docs/claude-code/headless]]
[[ogp:https://docs.claude.com/en/docs/claude-code/slash-commands]]
[[ogp:https://en.wikipedia.org/wiki/GitHub_Codespaces]]
