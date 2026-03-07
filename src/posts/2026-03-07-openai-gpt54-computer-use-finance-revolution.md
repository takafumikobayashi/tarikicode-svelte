---
title: 'OpenAI GPT-5.4登場：PC操作で人間を超え75%、Excel統合で金融AIが新次元へ'
date: '2026-03-07'
category: 'AI'
tags: ['OpenAI', 'GPT-5.4', 'AIエージェント', '金融AI', 'コンピュータ操作']
description: 'OpenAIが3月5日にGPT-5.4を発表。OSWorld-Verifiedで75%を記録しComputer Use機能を初搭載。ChatGPT for Excelベータ開始・Google Sheets対応予定など金融業務AIが新次元へ突入した。'
image: 'https://techcrunch.com/2026/03/05/openai-launches-gpt-5-4-with-pro-and-thinking-versions/'
featured: false
type: 'blog'
---

OpenAIは2026年3月5日、新フラッグシップモデル「**GPT-5.4**」をリリースした。今回の最大の特徴は**ネイティブなコンピュータ操作（Computer Use）機能**の搭載と、Excelへの直接統合（ベータ）、さらに機関投資家向け金融データとの連携だ。AIが単なる「質問応答ツール」から「UI操作アクションを返してワークフローを自動化するエージェント」へと本格的に進化した節目となるリリースといえる。

### GPT-5.4の概要

GPT-5.4はOpenAIが「推論・コーディング・エージェントワークフローを一つに統合した初の汎用モデル」と位置付ける最新フラッグシップ。ChatGPT、Codex、APIの各プラットフォームで提供され、2つのティアが用意されている。

| ティア               | 利用可能なChatGPTプラン                        |
| -------------------- | ---------------------------------------------- |
| **GPT-5.4 Thinking** | Free / Go / Plus / Pro / Business / Enterprise |
| **GPT-5.4 Pro**      | Pro / Business / Enterprise                    |

コンテキストウィンドウは**1,050,000トークン**（API・Codex）に対応し、最大出力は128,000トークン。272,000トークン超では入力・出力ともに単価が上がる仕様。

---

### ネイティブ「コンピュータ操作」機能：人間ベースラインを超えた75%

#### 何ができるのか

GPT-5.4は、OpenAI初の**一般用途モデルとしてネイティブなComputer Use機能を搭載した**モデルだ。スクリーンショットを入力として受け取り、UIを通じたソフトウェア操作のためのアクションを返す仕組みで、具体的には2つのアプローチを持つ。

1. **コード経由の操作**：PlaywrightなどのライブラリでWebブラウザやアプリを自動操作するコードを生成し、ハーネス側で実行
2. **ビジュアル経由の操作**：スクリーンショットから画面状態を認識し、クリック・キーボード入力などの操作アクションを返す。実際の操作はカスタムハーネスやアプリ側が受け取って実行する

これにより、複数アプリをまたぐ複雑なワークフローをAIエージェントとして自律実行できるようになった。

#### ベンチマーク：人間超えのOSWorld-Verified 75%

PCのGUI操作能力を測るベンチマーク「**OSWorld-Verified**」でGPT-5.4は**75**%を記録し、人間ベースラインを上回った。

| ベンチマーク                            | GPT-5.4 | GPT-5.4 Pro | Gemini 3.1 Pro | Claude Opus 4.6      |
| --------------------------------------- | ------- | ----------- | -------------- | -------------------- |
| **OSWorld-Verified** (PC操作)           | 75%     | -           | -              | -                    |
| **BrowseComp** (Web情報収集)            | 82.7%   | 89.3%       | -              | -                    |
| **GDPval** (専門知識タスク44種)         | 83.0%   | 82.0%       | -              | -                    |
| **SWE-Bench Pro Public** (コーディング) | 57.7%   | -           | 54.2%          | リーダー（Verified） |
| **投資銀行業務ベンチマーク**            | 87.3%   | 83.6%       | -              | -                    |

特筆すべきは投資銀行業務ベンチマーク。3ステートメントモデルの構築・書式整形・引用を含む実務ワークフローの評価で、**GPT-5からの43.7%がGPT-5.4 Thinkingで87.3%に倍増**した。

---

### 金融業務AIへの展開：Excel統合と機関投資家データ連携

#### ChatGPT for Excel（ベータ）・Google Sheets（近日対応予定）

GPT-5.4と同時に、**ChatGPT for Excelがベータリリース**された。Google Sheetsへの統合は現時点では「coming soon」となっており、今後の対応が予定されている。

- Excelのワークブック内からChatGPTを直接呼び出し、セルやフォーミュラを参照しながら財務モデルを構築・更新・シナリオ分析
- GPT-5.4 Thinkingがバックエンドで動作
- 自然言語での指示だけで財務三表モデルや感度分析テーブルを自動生成

#### 機関投資家向けデータ統合

ChatGPT内で直接利用できる金融データプロバイダーとの統合が発表された。発表時点で提供開始済みのものと、今後展開予定のものに分かれる。

**本日提供開始：**

| プロバイダー      | データ種別                 |
| ----------------- | -------------------------- |
| Moody's           | 債券・リスクデータ         |
| Dow Jones Factiva | ニュース・調査レポート     |
| MSCI              | ポートフォリオ・リスク分析 |
| Third Bridge      | エキスパートインサイト     |
| MT Newswire       | リアルタイムニュース       |

**エコシステム連携・今後展開予定：**

| プロバイダー        | データ種別            |
| ------------------- | --------------------- |
| FactSet             | 企業財務・評価データ  |
| LSEG（旧Refinitiv） | マーケットデータ      |
| S&P Global          | 信用格付け・ESGデータ |
| Daloopa             | 財務モデリングデータ  |

証券アナリストや投資銀行部門が日々利用する機関向けデータをAIのコンテキストに直接取り込める環境が整いつつあり、**OpenAIは金融業界向けにAnthropicと真っ向から競合する姿勢**を鮮明にした。

---

### APIの価格体系

開発者向けAPI料金は以下の通り。コンテキスト長によって入力・出力の両方の単価が変わる点に注意が必要だ。

| モデル          | コンテキスト  | 入力（1M tokens） | 出力（1M tokens） |
| --------------- | ------------- | ----------------- | ----------------- |
| **GPT-5.4**     | 〜272K tokens | $2.50             | $15.00            |
| **GPT-5.4**     | 272K tokens超 | $5.00             | $22.50            |
| **GPT-5.4 Pro** | 〜272K tokens | $30.00            | $180.00           |
| **GPT-5.4 Pro** | 272K tokens超 | $60.00            | $270.00           |

272,000トークンを超えると入力・出力ともに単価が上昇する（標準は入力2倍・出力1.5倍、Proも同比率）。データレジデンシー・地域処理エンドポイント向けには全料金に10%の追加課金が設定されている。

---

### GitHub Copilotへの統合

GPT-5.4はリリース当日にGitHub Copilotでも一般提供（GA）が開始された。コーディング評価については、**SWE-Bench Pro Public**（OpenAI独自評価）ではGPT-5.4が57.7%、Gemini 3.1 Proが54.2%。一方、**SWE-Bench Verified**（独立評価）ではClaude Opus 4.6が依然リーダーを維持している。なお両者は評価セットと測定方法が異なるため、直接比較はできない点に注意が必要だ。

---

### まとめ

- **ネイティブPC操作**：GPT-5.4はOSWorld-Verified 75%で人間ベースラインを上回り、一般向けモデルとして初の本格エージェント機能を搭載
- **金融業務革命**：ChatGPT for Excel（ベータ）＋7つの機関向けデータ連携で、投資銀行業務ベンチマークをGPT-5比で2倍（43.7%→87.3%）に改善。Google Sheets対応も予定
- **コーディング評価**：SWE-Bench Pro Public（OpenAI独自）ではGPT-5.4が57.7%でGemini 3.1 Pro（54.2%）を上回る。SWE-Bench Verified（独立評価）ではClaude Opus 4.6が依然リーダー。両者は評価セットと測定方法が異なるため直接比較不可
- **価格設定**：標準$2.50/1M入力は手頃だが、Pro層（$30/1M入力）は高性能推論専用のプレミアム価格
- **業界へのインパクト**：AIが「質問に答えるツール」から「UI操作アクションを返してワークフローを自動化するエージェント」への転換が、一般向け製品として現実のものになった

**情報ソース：**

[[ogp:https://openai.com/index/chatgpt-for-excel/|https://images.ctfassets.net/kftzwdyauwt9/7bSi1GJxlKgzkl3OaftYh5/453b92e8255940d43f2474386c5ae031/ChatGPT_Excel_seo.png|Introducing ChatGPT for Excel and new financial data integrations|OpenAI introduces ChatGPT for Excel and new financial app integrations, powered by GPT-5.4 to accelerate modeling, research, and analysis in regulated environments.|@OpenAI]]

[[ogp:https://techcrunch.com/2026/03/05/openai-launches-gpt-5-4-with-pro-and-thinking-versions/]]

[[ogp:https://venturebeat.com/technology/openai-launches-gpt-5-4-with-native-computer-use-mode-financial-plugins-for|https://images.ctfassets.net/jdtwqhzvc2n1/7gCGOQwpwVqoiYYxNjmHUr/c5592b27e579e176b853eb1e356e52fe/ChatGPT_Image_Mar_5__2026__11_22_33_AM.png|OpenAI launches GPT-5.4 with native computer use mode, financial plugins for Excel, Sheets|The big headlines on this release are efficiency, with OpenAI reporting that GPT-5.4 uses far fewer tokens (47% fewer on some tasks) than its predecessors).|VentureBeat]]

[[ogp:https://www.bloomberg.com/news/articles/2026-03-05/openai-releases-new-financial-services-tools-rivaling-anthropic|https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iCnKRLkpg9t8/v1/1200x836.jpg|OpenAI Releases New Financial-Services Tools, Rivaling Anthropic|OpenAI is releasing a new flagship artificial intelligence model and a suite of financial-services tools that are meant to be better at tackling office work, ramping up competition with Anthropic PBC as the rival firm faces new risks from a showdown with the Pentagon.|Bloomberg.com]]
