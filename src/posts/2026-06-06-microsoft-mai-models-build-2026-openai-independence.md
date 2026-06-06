---
title: 'Microsoftが自社AI「MAI」7モデルを公開：MAI-Code-1-FlashがHaiku 4.5をSWE-Bench Proで+16pt、脱OpenAI依存が本格化'
date: '2026-06-06'
category: 'AI'
tags: ['Microsoft', 'GitHub Copilot', 'AIエージェント', 'Coding', 'LLM']
description: 'MicrosoftがBuild 2026で自社開発AI「MAI」7モデルを発表。コーディング用MAI-Code-1-FlashはSWE-Bench ProでHaiku 4.5を+16pt上回り最大60%トークン削減。GPT依存を脱する自前知能戦略を解説。'
image: 'https://microsoft.ai/news/introducingmai-code-1-flash/'
featured: true
type: 'blog'
---

### はじめに

2026年6月2日、Microsoftは開発者会議「Build 2026」で、自社開発したAIモデル群「MAI（Microsoft AI）」7モデルを一挙に公開しました。発表したのはMicrosoft AI部門CEOのMustafa Suleyman氏。これまでGitHub CopilotやMicrosoft 365 Copilotの中核知能はパートナーであるOpenAIのGPTに大きく依存してきましたが、今回その心臓部を自前モデルに置き換え始めたことが最大のポイントです。

Suleyman氏は今回の狙いを「Microsoftとパートナーにとっての長期的な自給自足（long term self-sufficiency）」と表現しました。本記事では、開発者に最も関係が深いコーディングモデル「MAI-Code-1-Flash」と推論モデル「MAI-Thinking-1」を軸に、Microsoftの戦略転換と、激化する「コーディングモデル戦争」の構図を整理します。

### 1. Build 2026で何が発表されたのか

#### 1.1 発表概要

| 項目             | 内容                                                         |
| ---------------- | ------------------------------------------------------------ |
| 発表日           | 2026年6月2日（Build 2026）                                   |
| 発表者           | Mustafa Suleyman（Microsoft AI CEO / Superintelligence Team） |
| 公開モデル数     | 自社開発7モデル（MAIファミリー）                            |
| 主役モデル       | MAI-Code-1-Flash（コーディング）/ MAI-Thinking-1（推論）    |
| 戦略目的         | OpenAIへの一極依存からの脱却・コスト効率の改善              |
| 提供チャネル     | モデルにより異なる（GitHub Copilot / VS Code / Microsoft Foundry） |

提供チャネルはモデルごとに異なります。MAI-Code-1-FlashはGitHub Copilot / VS Code側に、MAI-Thinking-1はMicrosoft Foundryのプライベートプレビューとして提供されます。

#### 1.2 なぜ「自社モデル」が重大なのか

CopilotはこれまでGPTを中核に据え、Microsoftは事実上OpenAIの知能を再販する立場でした。今回MAIを投入したことで、Microsoftは「課金体系（6月1日に従量課金へ移行したCopilot）」と「中核モデル」の両方を自社で握る垂直統合へ動き始めたことになります。Suleyman氏によれば、コンサルティング大手McKinsey向けにチューニングしたケースでは、**OpenAIのGPT-5.5を上回りつつコスト効率は約10倍**だったとしています（Microsoft自社発表）。

### 2. MAI-Code-1-Flash：軽量級コーディングモデルの刺客

#### 2.1 ポジショニング

MAI-Code-1-Flashは、自然言語の指示からアプリやWebサイトのソースコードを生成する「推論超効率（inference ultra-efficient）」を掲げた軽量コーディングモデルです。GitHub Copilotの本番環境で使われているハーネス（実行基盤）を使って直接学習させたとされ、Copilotにネイティブ最適化されている点が特徴です。比較対象として明示されているのは、同じ軽量級であるClaude Haiku 4.5です。

#### 2.2 ベンチマーク比較（Microsoft自社測定）

| ベンチマーク             | MAI-Code-1-Flash | Claude Haiku 4.5 | 差分      |
| ------------------------ | ---------------- | ---------------- | --------- |
| SWE-Bench Pro            | 51.2%            | 35.2%            | +16.0pt   |
| Instruction Following（IF Bench） | —       | —                | +28.9pt   |
| Advanced IF              | —                | —                | +14.5pt   |
| Adversarial Reasoning（調整精度） | 85.8%   | —                | —         |
| SWE-Bench Verified トークン効率 | 最大60%削減 | 基準         | —         |

数値はいずれもMicrosoftの公式発表に基づくもので、第三者による独立検証ではない点に注意してください。とはいえ、軽量モデル同士の比較でSWE-Bench Proを+16pt引き離し、かつ最大60%少ないトークンで解くという主張は、Copilot上での実コストに直結する重要なポイントです。

#### 2.3 価格と提供範囲

GitHub Copilotの新しいトークンベース課金において、MAI-Code-1-FlashはClaude Haiku 4.5よりも安価に設定されています。現在はVS CodeのGitHub Copilot個人ユーザー向けにロールアウト中で、モデルを自動選択する「Auto picker」経由でも利用される場合があります。

### 3. MAI-Thinking-1：推論級に挑む1T MoE

#### 3.1 アーキテクチャと仕様

| 項目           | 内容                                       |
| -------------- | ------------------------------------------ |
| パラメータ     | アクティブ35B / 総数 約1T（スパースMoE）   |
| コンテキスト長 | 256Kトークン（約600ページ相当）            |
| 学習データ     | クリーン・適切にライセンスされたデータ     |
| 学習方針       | 第三者モデルからの蒸留なし／プリトレーニングからAI生成コンテンツを除外 |
| 提供状況       | Microsoft Foundryでプライベートプレビュー（MAI Playgroundで公開予定） |

#### 3.2 ベンチマーク比較（Microsoft自社測定）

| ベンチマーク      | MAI-Thinking-1 | 比較対象・メモ                         |
| ----------------- | -------------- | -------------------------------------- |
| AIME 2025         | 97.0%          | —                                      |
| AIME 2026         | 94.5%          | —                                      |
| SWE-Bench Pro     | 約53%          | Claude Opus 4.6と肩を並べる水準        |
| 人間評価（Surge） | 選好           | 1,276タスクの盲検でSonnet 4.6より選好  |

蒸留に頼らずゼロから学習したモデルがOpus 4.6級の推論ベンチに並ぶというのは、Microsoftが「借り物ではない知能」を一定水準まで自前で作れることを示すマイルストーンです。一方で現時点ではFoundryのプライベートプレビュー段階であり、一般開発者がすぐ触れるのはMAI-Code-1-Flashの方です。

### 4. 「コーディングモデル戦争」の現在地

今回のMAI投入は単独のニュースではなく、各社がコーディング領域に総力を注ぐ大きな流れの一部と見るのが自然です。ここからは、6月1日のCNBC報道（MicrosoftとGoogleがAIコーディングでAnthropic・OpenAIを追う構図）や各社の公開情報をもとに、筆者なりに競争構図を整理した分析パートです。

| 陣営      | 主力             | 直近の動き                                       |
| --------- | ---------------- | ------------------------------------------------ |
| Anthropic | Claude Code      | コーディングで先行。6月1日に非公開でIPO申請（Reuters報道） |
| OpenAI    | Codex            | エンタープライズ重視を強め、Claude Codeに対抗（業界分析） |
| Google    | Gemini / Antigravity | I/Oで月$100の開発者ティアを打ち出し価格で訴求    |
| Microsoft | Copilot + MAI    | 自社モデルで中核を内製化、6月1日に従量課金へ移行 |

報道ベースでは、Google CEOのSundar Pichai氏がエージェント的コーディングの領域で「現時点では少し遅れている」と率直に認めたとされます。事実関係として確実なのは、Microsoftが自社モデルで参入し、各社がコーディングを主戦場に据えているという方向感です。

### 5. 開発者にとっての実務的インパクト

- Copilotユーザーは選択肢が増える：従量課金に移行したCopilot上で、安価なMAI-Code-1-Flashが選べるようになり、軽量タスクのコストを下げやすくなります。
- Auto pickerの挙動を理解する：自動選択でMAIに振られるケースがあるため、どのモデルが使われたかを意識した運用が重要になります。
- ベンチは自社測定：MAIの優位性はMicrosoft自身の測定値です。実プロジェクトでは小さく試して自分のワークロードで比較するのが安全です。

### 6. まとめ

- Microsoftは2026年6月2日のBuild 2026で、自社開発した**MAI 7モデル**を公開し、Copilotの中核知能をGPTから内製モデルへ移行し始めた。
- コーディング用**MAI-Code-1-Flash**は、軽量級のClaude Haiku 4.5に対しSWE-Bench Proで+16pt（51.2% vs 35.2%）、最大60%のトークン削減を主張し、Copilot上でHaiku 4.5より安価。
- 推論用**MAI-Thinking-1**はアクティブ35B/総1TのMoEで、AIME 2025で97.0%、SWE-Bench ProでOpus 4.6級。ただし現状はFoundryのプライベートプレビュー。
- 背景には激化する「コーディングモデル戦争」があり、Anthropic（IPO申請）・OpenAI・Googleと並びMicrosoftが自社モデルで本格参戦した。
- いずれのベンチもMicrosoft自社測定であり、実ワークロードでの検証が前提となる。

### 7. 筆者の視点：日本の開発者はどう向き合うべきか

今回の発表が日本の開発者に突きつけるのは、AIコーディングの勝負がもはや単なるモデル性能比較ではないという現実だ。問われているのは、どのモデルを、どの仕事に、どんなコストで割り当てるかという運用設計の巧拙へと移りつつある。

日本企業はPoC段階では盛り上がるが、本番導入ではコスト管理やガバナンス、既存開発プロセスとの整合で足が止まりやすい。そう見れば、今回のMAI投入で本当に効いてくるのは「Microsoftも強いモデルを出した」という事実そのものではない。Copilotの中で軽量・低コストな自社モデルを使い分ける余地が広がったこと、そちらの方がはるかに大きい。

開発現場がまず見るべきは、公開ベンチマークの順位ではない。自社のリポジトリ、チケット、レビュー体制、CI/CD、既存の設計ルールの中で、どこまで実際に工数が削れ、どこで品質リスクが増えるのか。そこに尽きる。軽量モデルは雛形生成や単純な修正、テスト補助、ドキュメント更新といった反復作業では効きやすい一方、複雑な業務ロジックや暗黙知の多い既存システムでは、人間の監督を厚く残さねば危うい。

だとすれば、日本の開発者がこれから磨くべきは「最強モデルを当てる力」ではなく、**モデルを適材適所にルーティングする力**だろう。Copilotの内部でもMAIとGPT系の役割は分かれていく可能性があり、ClaudeやGeminiまで視野に入れれば、論点は「どのAIを使うか」から「どの仕事に何を使うか」へと変わる。

Microsoftの今回の一手は、OpenAI依存からの脱却という経営戦略であると同時に、開発者に対しても「AIコーディングは道具箱として使い分ける時代に入った」と告げるものだ。日本の現場に求められるのも、導入の可否を問う段階ではない。タスク分解、コスト設計、品質管理まで含めてAI活用を再設計する視点こそが、これまで以上に問われることになる。

**情報ソース：**

[[ogp:https://microsoft.ai/news/introducingmai-code-1-flash/]]

[[ogp:https://microsoft.ai/news/introducing-mai-thinking-1/]]

[[ogp:https://www.cnbc.com/2026/06/02/microsoft-unveils-new-ai-models-lessen-reliance-on-openai-lower-costs.html]]

[[ogp:https://www.geekwire.com/2026/microsoft-unveils-seven-homegrown-ai-models-in-bid-for-long-term-self-sufficiency/]]

[[ogp:https://www.cnbc.com/2026/06/01/microsoft-and-google-take-on-anthropic-and-openai-in-ai-coding-models.html]]
