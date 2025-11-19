---
title: 'Google Gemini 3がついに登場：GPT-5.1を圧倒するベンチマーク性能と新IDE「Antigravity」'
date: '2025-11-19'
category: 'AI'
tags: ['Google', 'Gemini', 'LLM', 'AI開発', 'エージェントAI']
description: '2025年11月18日、GoogleがGemini 3を発表。Humanitys Last Examで37.5%を記録しGPT-5.1の26.5%を大幅に上回る。新IDE「Antigravity」も同時公開。'
image: 'https://blog.google/products/gemini/gemini-3/'
featured: true
type: 'blog'
---

### AI業界を震撼させたGemini 3の登場

2025年11月18日、Googleは最新AIモデル「**Gemini 3**」を発表しました。Gemini 2.5の発表からわずか8ヶ月での刷新となり、AI業界全体に大きな衝撃を与えています。

Gemini 3 Proは、多数の主要ベンチマークでGPT-5.1やClaude Sonnet 4.5に対して優位性を示し、**コミュニティ運営のLMArena Leaderboardで1501 Elo（2025年11月18日時点）という過去最高スコア**を記録しました。さらに、Googleは新しいエージェント型開発プラットフォーム「**Google Antigravity**」を同時発表し、AI駆動の開発体験を大きく進化させています。

### Gemini 3とは

Gemini 3は、Googleが開発した第3世代のマルチモーダルAIモデルです。前世代のGemini 2.5と同じ技術基盤を持ちながら、推論能力とエージェント機能が大幅に強化されています。

#### 基本仕様

- **入力コンテキスト**: 最大100万トークン
- **出力トークン**: 最大64,000トークン
- **マルチモーダル対応**: テキスト、画像、音声、動画
- **知識カットオフ**: 2025年1月

Google DeepMindのCEO、Demis Hassabisは「Gemini 3は、ありきたりな回答やお世辞ではなく、ユーザーが聞きたいことではなく聞くべきことを伝える」と述べており、**sycophancy（おべっか）の削減**がモデル設計の重要な目標だったことを明らかにしています。

### 圧倒的なベンチマーク性能

Gemini 3 Proは、複数の主要ベンチマークで競合モデルを圧倒する結果を示しています。

> **注記**: 以下のベンチマーク数値は複数のテックメディアの報告に基づいています。Google公式の技術論文が公開され次第、正式な数値を確認することをおすすめします。

#### Humanity's Last Exam（ツール未使用）

| モデル | スコア | 備考 |
|--------|--------|------|
| **Gemini 3 Pro** | **37.5%** | 新記録達成 |
| GPT-5 Pro（前記録保持） | 31.64% | - |
| GPT-5.1 | 26.5% | - |
| Claude Sonnet 4.5 | 13.7% | - |

Gemini 3 Proは検索とコード実行を使用した場合、**45.8%**までスコアが向上します。

#### ARC-AGI-2（視覚推論パズル）

| モデル | スコア | 前バージョン比 |
|--------|--------|----------------|
| **Gemini 3 Pro** | **31.1%** | +532%（2.5 Pro比） |
| GPT-5.1 | 17.6% | - |
| Claude Sonnet 4.5 | 13.6% | - |
| Gemini 2.5 Pro | 4.9% | - |

ARC Prizeの創設者François Cholletは、「Gemini 3 ProとDeep Thinkは、ARC v2で現在のSOTA（最先端）を2倍以上上回る」とコメントしています。

#### その他の主要ベンチマーク

- **LMArena Leaderboard**: 1501 Elo（2025年11月18日時点、コミュニティ運営の非公式指標）
- **GPQA Diamond**: 91.9%
- **SWE-bench Verified**: 76.2%（コーディングエージェント能力）
- **Terminal-Bench 2.0**: 54.2%（ターミナル操作能力）

### 主要な新機能

#### Deep Think モード

Gemini 3には、複雑な問題に対してより深い推論を行う「**Deep Think**」モードが搭載されています。

Deep Thinkの性能：

- **Humanity's Last Exam**: 41.0%（通常モードより+3.5%）
- **GPQA Diamond**: 93.8%
- **ARC-AGI-2**（コード実行使用）: 45.1%

このモードは、数学、科学、複雑なロジックパズルに特に効果を発揮します。

#### Generative UI

Gemini 3は単なるテキスト応答だけでなく、**カスタムインタラクティブUIを動的に生成**できます。これは開発者コミュニティで「Vibe Coding」と呼ばれる新しいパラダイムを実現し、自然言語の説明だけで完全な機能を持つWebアプリケーションを生成できます。

#### Thinking Tokens

APIでは初めて「思考プロセス」が課金対象トークンとして公開されました。これにより、開発者は必要な場合にのみ深い推論のコストを支払うことができます。

### Google Antigravity：エージェント型IDE

Gemini 3と同時に発表された「**Google Antigravity**」は、AI駆動の開発を次のレベルに引き上げる新しいプラットフォームです。

#### 主な特徴

- **エージェントファースト設計**: 従来のIDEをエージェント中心に再構築
- **3つの統合サーフェス**: エージェントマネージャー、VS Code型エディタ、Chrome拡張によるブラウザ統合
- **自律的なコード実行**: エディタ、ターミナル、ブラウザを横断して自律的に動作
- **マルチモデル対応**: Gemini 3、Anthropic Sonnet 4.5、OpenAI gpt-ossをサポート

複数の業界筋の報道によると、AntigravityはGoogleがWindsurfの技術をベースに開発したとされています。Windsurf CEOのVarun Mohanを含むチームがGoogleに加わり、開発に参加していると報じられていますが、契約の詳細は公式には発表されていません。

#### 利用可能プラットフォーム

パブリックプレビューとして、**MacOS、Windows、Linux**で無料ダウンロードが可能です。

### API料金

Gemini 3 Pro APIは、コンテキスト長に応じた階層型価格設定を採用しています。

| コンテキスト長 | 入力（/100万トークン） | 出力（/100万トークン） |
|---------------|----------------------|----------------------|
| 200K以下 | $2.00 | $12.00 |
| 200K超 | $4.00 | $18.00 |

#### 無料枠

Google AI Studioでは、レート制限付きで**無料利用**が可能です。プレビュー期間中は、多くの開発者が数千リクエストを実行しても請求が$0だったと報告しています。

### AI競争の現状

Gemini 3の発表は、AI業界の競争がさらに激化していることを示しています。

#### 主要プレイヤーの現状

- **Geminiアプリ**: 月間6億5000万アクティブユーザー
- **AI Overviews**: 月間20億ユーザー
- **ChatGPT**: 週間7億ユーザー（2025年8月時点）

OpenAIは2025年11月12日にGPT-5.1のアップデートを2つリリースし、「より温かく、インテリジェントで、指示への追従が向上した」バージョンを展開しています。一方、Anthropicは2025年にClaude Opus 4.1（8月）、Sonnet 4.5（9月）、Haiku 4.5（10月）を相次いでリリースし、特にコーディングとエージェント機能で差別化を図っています。

### まとめ

Google Gemini 3は、AI業界に新たな基準を設定する重要なリリースです。

主要ポイント：

- **ベンチマーク性能**: Humanity's Last Examで37.5%を記録し、GPT-5.1（26.5%）を大幅に上回る
- **Deep Thinkモード**: 複雑な推論タスクでさらに高い性能を発揮（ARC-AGI-2で45.1%）
- **Google Antigravity**: エージェント型開発の新しいパラダイムを提示するIDE
- **Vibe Coding**: 自然言語からWebアプリを生成する新しいコーディング体験（開発者コミュニティでの俗称）
- **API料金**: $2/$12（100万トークン）の競争力ある価格設定

Gemini 3は、AI競争が推論能力とエージェント機能の両面で新たなフェーズに入ったことを示しています。開発者にとっては、Google Antigravityの登場により、AI駆動の開発ワークフローがさらに身近なものになりそうです。

### 参考リンク

[[ogp:https://blog.google/products/gemini/gemini-3/]]
[[ogp:https://antigravity.google]]
[[ogp:https://research.google/]]
[[ogp:https://deepmind.google/discover/]]
[[ogp:https://arcprize.org/]]
[[ogp:https://www.windsurf.ai/]]
[[ogp:https://youtu.be/nTOVIGsqCuY?si=Hw0mSwmQ46UkTuNz]]
