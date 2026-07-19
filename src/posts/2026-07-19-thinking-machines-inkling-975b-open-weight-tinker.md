---
title: 'Inkling登場：Thinking Machines初モデルは975BをApache 2.0で無償公開、"最強を狙わない"戦略で勝負'
date: '2026-07-19'
category: 'AI'
tags: ['Thinking Machines', 'オープンソースLLM', 'ファインチューニング', 'LLM', 'マルチモーダル']
description: '元OpenAI CTOミラ・ムラティ氏のThinking Machinesが2026年7月15日、初の自社モデル「Inkling」を発表。975B（アクティブ41B）のマルチモーダルMoEをApache 2.0で完全公開し、微調整基盤Tinkerで収益化する戦略を検証する。'
image: 'https://thinkingmachines.ai/news/introducing-inkling/'
featured: true
type: 'blog'
---

### はじめに

2026年7月15日、元OpenAI CTOのミラ・ムラティ氏が率いるThinking Machines Labは、初の自社開発モデル「Inkling」を発表しました。総パラメータ975B（アクティブ41B）のMixture-of-Expertsで、テキスト・画像・音声を入力として扱うネイティブマルチモーダルモデルです（事前学習データには動画も含まれます）。重みはApache 2.0ライセンスでHugging Faceに公開されており、商用利用・改変・再配布が可能です。

注目すべきは、公式発表自身が「**Inklingは現在利用できる最強のモデルではない。オープンでもクローズドでも**」と明言している点です。フロンティア性能を競うのではなく、「モデルは無償で配り、それを自社用にカスタマイズする基盤（Tinker）を売る」という戦略の出発点としてInklingを位置づけています。同じ週にMoonshot AIがKimi K3で「規模の頂点」を狙ったのとは対照的なアプローチです。

本記事では、Thinking Machines公式ブログとモデルカードを一次ソースとして、スペック・ベンチマーク・戦略を整理します。

### 基本スペック

| 項目                   | 内容                                                         |
| ---------------------- | ------------------------------------------------------------ |
| 総パラメータ数         | 975B（MoE）                                                  |
| アクティブパラメータ   | 約41B／トークン                                              |
| エキスパート構成       | ルーティング256＋共有2（各層）、トークンごとに6つが発火      |
| コンテキストウィンドウ | 最大1Mトークン                                               |
| モダリティ             | 入力：テキスト・画像・音声／出力：テキスト                   |
| 事前学習               | 45兆トークン（テキスト・画像・音声・動画を含む）             |
| 推論制御               | thinking effortを連続値で調整可能                            |
| ライセンス             | Apache 2.0（Hugging Faceで重み公開）                         |
| 派生モデル             | Inkling-Small（276B・アクティブ12B）をプレビュー公開         |

アーキテクチャ面では、シグモイドベースのルーターに補助損失を使わないロードバランシングを組み合わせ、注意機構はスライディングウィンドウ層とグローバル層を5:1で交互に配置しています。最適化には大きな重み行列にMuon、それ以外にAdamを使い分けるハイブリッド構成を採用。ポストトレーニングでは合成データによるSFTの後、**3,000万ロールアウト超の大規模強化学習**を実施し、推論性能が訓練を通じて対数線形で伸び続けたと報告しています。公式によれば、MoE設計はDeepSeek-V3をおおむね踏襲しています。米国のフロンティア系スタートアップが中国発オープンモデルの設計を公式に参照点として挙げるのは、オープンウェイト圏の技術還流を示す一例です。

### ベンチマーク：オープン級では上位、ただし「最強」は自認せず

公式発表の主要スコア（thinking effort 0.99での測定値）は以下の通りです。

| 領域           | ベンチマーク         | スコア |
| -------------- | -------------------- | ------ |
| 数学           | AIME 2026            | 97.1%  |
| 科学推論       | GPQA Diamond         | 87.2%  |
| 総合推論       | HLE（ツールあり）    | 46.0%  |
| コーディング   | SWE-Bench Verified   | 77.6%  |
| 端末操作       | Terminal-Bench 2.1   | 63.8%  |
| Webエージェント | BrowseComp           | 77.1%  |
| 音声           | VoiceBench           | 91.4%  |
| 安全性         | FORTRESS（敵対的）   | 78.0%  |

公式の比較チャートによれば、FORTRESS（敵対的プロンプト耐性）ではオープンウェイト群の先頭に立つ一方、Terminal-Bench 2.1ではGLM-5.2の82.7%に大きく届きません。コーディングエージェント特化のGLM-5.2、規模で頂点を狙うKimi K3に対し、Inklingは**推論・コーディング・音声・視覚・安全性を一定水準で兼ね備えた「広さ」**を売りにしており、単一領域の首位争いには参加していないことが数字からも読み取れます。

一方で、最上位クローズドモデルと比べると、SimpleQA Verified 43.9%やTau 3 Banking 23.7%には明確な差があり、事実検索や専門業務へそのまま投入するより、検索・RAGやファインチューニングを組み合わせる前提で見るべきです。この「素の状態では完成品ではない」という性質は、後述するファインチューニング前提の設計思想と表裏一体です。

### 戦略：モデルを配り、Tinkerを売る

Thinking Machinesの収益源は、モデルのAPI販売ではなくファインチューニング基盤「Tinker」です。Inklingは発表と同時にTinkerで微調整可能になっており（64Kと256Kのコンテキストオプション、期間限定で50%割引）、音声対応のレシピを含むcookbookの更新、ツールコールとマルチモーダル入力を扱うレンダラーライブラリの公開など、**「自社データで作り変える」ためのツール群が本体と同時に整備**されています。

推論はTogetherAI、Fireworks、Modal、Databricks、Basetenなどのパートナー経由で提供され、SGLang・vLLM・llama.cppといった主要フレームワークにも対応。Fortuneは、ヘッジファンドのBridgewater AssociatesがTinkerの顧客として金融タスク向けの性能改善に使っていると報じています。

同社は2025年2月の創業で、製品出荷前に約20億ドルのシード調達（評価額120億ドル）を実施したと報じられており、複数の報道は、Inklingを発表時点で米国企業が公開した最大級のオープンウェイトモデルと位置づけています。「フロンティアラボからAIを借りるのではなく、自社で所有・改変したい企業」に賭けるという構図は、クローズドAPIで頂点を競うOpenAI・Anthropicとも、規模で追うMoonshotとも異なる第三の路線です。

### 注意点

- 公式自身が「最強モデルではない」と明言しており、汎用アシスタント用途で最上位モデルの代替にはなりません
- 事実性のSimpleQA Verified 43.9%は最上位クローズドモデルに大きく及ばず、事実回答には検索・RAGの併用が前提になります
- 975B（アクティブ41B）の自社ホストには相応のGPU基盤が必要です。軽量なInkling-Small（276B・アクティブ12B）はプレビュー段階です
- Tinkerの50%割引とPlaygroundの無料提供は期間限定と案内されており、恒常価格は別途確認が必要です

### まとめ

- Thinking Machines Labが2026年7月15日、初の自社モデルInklingを発表。975B（アクティブ41B）のマルチモーダルMoEで、1Mコンテキスト・thinking effort連続制御に対応し、重みはApache 2.0でHugging Face公開
- 公式スコアはAIME 2026 97.1%・GPQA Diamond 87.2%・VoiceBench 91.4%など。安全性ベンチマークFORTRESSでは公式比較チャートでオープンウェイト群の先頭に立つ一方、Terminal-Bench 2.1はGLM-5.2に大きく及ばない
- 公式発表自身が「最強のモデルではない」と明言。単一領域の首位ではなく、微調整の土台となる「広さ」を優先した設計
- 収益源はモデルではなくファインチューニング基盤Tinker。「モデルを配り、カスタマイズを売る」路線で、クローズドAPI勢とも規模追求のオープン勢とも異なる第三の戦略
- 最上位クローズドモデルとの事実性の差や自社ホストのハードルなど、そのまま使うモデルではない点には注意。評価は「微調整後にどこまで化けるか」で決まる

**情報ソース：**

[[ogp:https://thinkingmachines.ai/news/introducing-inkling/]]

[[ogp:https://techcrunch.com/2026/07/15/thinking-machines-amps-up-its-bet-against-one-size-fits-all-ai-with-its-first-open-model-inkling/]]

[[ogp:https://www.axios.com/2026/07/15/mira-murati-thinking-machines-open-weight-model-inkling|https://images.axios.com/YNfZoGXtdA0ZFmUOKB6SlGIAfH0=/0x0:1920x1080/1366x768/2025/11/14/1763154503302.jpeg|Thinking Machines' first model bets big on customization|Murati's $12 billion lab wants enterprises to make its AI their own, not rent someone else's.|Axios]]

[[ogp:https://fortune.com/2026/07/15/what-is-mira-murati-thinking-machines-first-ai-model-inkling/]]
