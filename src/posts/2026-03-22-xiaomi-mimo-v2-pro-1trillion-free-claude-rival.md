---
title: '謎のモデル「Hunter Alpha」の正体はXiaomi──1兆パラメータのMiMo-V2-Proが公開、エージェントベンチマークでClaude Opus 4.6に迫るコスト破壊'
date: '2026-03-22'
category: 'AI'
tags: ['Xiaomi', 'MiMo', 'LLM', 'オープンソース', 'AIエージェント']
description: 'Xiaomiが1兆パラメータのMiMo-V2-ProをOpenRouterに掲載。ClawEval 61.5でClaude Opus 4.6（66.3）に肉薄しGPT-5.2（50.0）を超える性能をGPT-5.2の約15%のコストで実現。提携フレームワーク経由で1週間の無料API提供も。'
image: 'https://images.ctfassets.net/jdtwqhzvc2n1/2HCPXa9wmUn3GxH2G23n1k/a1081f11043cf47149b1d3533186679d/Gemini_Generated_Image_ovvcbfovvcbfovvc.png'
featured: false
type: 'blog'
---

### 謎のモデル「Hunter Alpha」の正体はXiaomi──1兆パラメータのMiMo-V2-Proが公開、エージェントベンチマークでClaude Opus 4.6に迫るコスト破壊

2026年3月18日、OpenRouter上に「**Hunter Alpha**」という名のモデルが突如として現れた。属性情報はなく、スペックシートも公開されておらず、コミュニティは「DeepSeek V4の流出版では」と憶測した。しかし正体が判明したとき、AI業界は驚きに包まれた──それはスマートフォンメーカーとして知られる**Xiaomi（シャオミ）**のAI部門「MiMo」が開発した**MiMo-V2-Pro**だったのだ。

### MiMo-V2-Proとは何か

MiMo-V2-Proは、元DeepSeek研究者の**羅福利**（**Luo Fuli**）が率いるXiaomiのAIチームが構築した大規模言語モデルだ。**2026年3月18日**にXiaomi公式サイトおよびOpenRouterで公開が始まり、翌3月19日にReutersをはじめとする主要メディアが一斉に報道した。

モデルの特性を一言で表すなら「**エージェント特化型の1兆パラメータMoEモデル**」だ。単なる会話AIではなく、ターミナル操作・コード実行・複数ツール連携といった実環境のタスクを高精度で自律処理することを念頭に設計されている。

#### 主要スペック

| 項目                       | MiMo-V2-Pro                                        |
| -------------------------- | -------------------------------------------------- |
| 総パラメータ数             | 1兆以上（1T+）                                     |
| 推論時アクティブパラメータ | 42B（Sparse MoE）                                  |
| コンテキストウィンドウ     | 100万トークン（1M）                                |
| アーキテクチャ             | Mixture-of-Experts（MoE）+ Hybrid Attention（7:1） |
| 知識カットオフ             | 2025年5月                                          |
| APIリリース日              | 2026年3月18日                                      |

### アーキテクチャの革新：Hybrid Attention 7:1

MiMo-V2-Proが際立つ点の一つは、前世代モデル（MiMo-V2-Flash）で採用されていた**Hybrid Attention比率を5:1から7:1へ引き上げた**ことだ。

これは、全トークンの**85%はスキャン（低密度注意）**で処理し、残り**15%の最重要トークンにのみ高密度アテンションを集中**させる仕組みを意味する。大規模コンテキスト処理における計算コストを劇的に削減しつつ、精度を維持するための巧みな設計だ。

さらに、**MTP（Multi-Token Prediction）レイヤー**を軽量化して組み込むことで、推論速度を向上させている。

### ベンチマーク：Claude Opus 4.6の92%の性能

#### ClawEval（エージェントスキャフォールド評価）

| モデル          | ClawEval スコア |
| --------------- | --------------- |
| Claude Opus 4.6 | 66.3            |
| **MiMo-V2-Pro** | **61.5**        |
| GPT-5.2         | 50.0            |
| GLM-5           | 46.2            |

エージェント型AIの実力を測る**ClawEval**では61.5を記録し、Claude Opus 4.6の約**92%の性能**を達成。GPT-5.2を大きく上回った。

#### Terminal-Bench 2.0（ライブターミナル実行）

VentureBeatの報道によれば、ライブ環境でコマンドを実行する精度を評価する**Terminal-Bench 2.0**では**86.7**を達成し、Claude Sonnet 4.6を上回るとされている。ただし本スコアはXiaomi公式やOpenRouterでの一次ソース確認ができていないため、参考値として扱われたい。

#### Artificial Analysis Intelligence Index

Artificial Analysis社の包括的AIインテリジェンス指数では、MiMo-V2-Proは**世界8位、中国LLM中2位**にランクイン。同指数のテスト実行コストは**わずか$348**であり、GPT-5.2（$2,304）の**約15%**、Claude Opus 4.6（$2,486）の**約14%という驚異のコスト効率**を実現した。

### 価格比較：2つの視点で見るコスト優位

#### API単価比較（100万トークンあたり）

| モデル            | 入力（〜256K） | 出力（〜256K） | 入力（〜1M） | 出力（〜1M） |
| ----------------- | -------------- | -------------- | ------------ | ------------ |
| **MiMo-V2-Pro**   | **$1.00**      | **$3.00**      | **$2.00**    | **$6.00**    |
| Claude Sonnet 4.6 | $3.00          | $15.00         | —            | —            |
| Gemini 3.1 Pro    | $2.00          | $12.00         | —            | —            |
| GPT-5.2           | $1.75          | $14.00         | —            | —            |
| Claude Opus 4.6   | $5.00          | $25.00         | —            | —            |

API単価ベースでは、GPT-5.2に対して入力約**43%安**、出力約**79%安**。Claude Opus 4.6（出力$25/1M）比では出力**約12%のコスト**で同等に近い性能が得られる。

#### ベンチマーク実行コスト比較（Artificial Analysis Intelligence Index）

同一の包括的評価スイートを走らせた際の実コストでは差がさらに顕著になる。

| モデル          | インデックス実行コスト |
| --------------- | ---------------------- |
| **MiMo-V2-Pro** | **$348**               |
| GPT-5.2         | $2,304                 |
| Claude Opus 4.6 | $2,486                 |
| GLM-5           | $376（109M出力）       |

GPT-5.2比で**約85%削減**。この差はAPI単価だけでなく、MiMo-V2-Proが同タスクをより少ない出力トークン（77M）で完結させる効率性も反映している。

### 「DeepSeek効果」の連鎖：中国AIの台頭

この一件が示すのは、AI開発の競争地図が劇的に変化しているという事実だ。

2026年初頭のDeepSeek MHC-V4が欧米モデルの圧倒的なコスト優位を崩したのに続き、今度はスマートフォンメーカーとして知られるXiaomiが、元DeepSeek研究者を擁して1兆パラメータモデルを構築し、提携フレームワーク向けに1週間の無料APIアクセスを提供しながら公開した。

かつてはAnthropicやOpenAI、Googleの独壇場だったフロンティアモデル領域に、中国の企業が次々と参入している。しかも単なるベンチマーク競争ではなく、エージェントユースケースという実用性の高い領域で優位性を示している点が重要だ。

### アクセス方法

- **OpenRouter**：`xiaomi/mimo-v2-pro` で検索（掲載済み、通常API料金が適用）
- **Xiaomi公式**：[mimo.xiaomi.com/mimo-v2-pro](https://mimo.xiaomi.com/mimo-v2-pro)
- **Hugging Face**：`XiaomiMiMo/MiMo-V2-Pro` リポジトリからウェイトも公開予定

### まとめ

- Xiaomiの**MiMo-V2-Pro**が2026年3月18日に公開開始、3月19日に主要メディアが一斉報道。1兆パラメータのMoEモデル
- ClawEval 61.5でClaude Opus 4.6（66.3）に肉薄、GPT-5.2（50.0）を超えるエージェント性能
- Terminal-Bench 2.0では86.7を達成、コーディング・実環境タスクに強み
- API料金は出力$3/1M（256Kまで）と業界最安水準。GPT-5.2比インデックス実行コストは約85%削減
- Xiaomiは5つの主要エージェントフレームワークと提携し、1週間の無料APIアクセスを提供。元DeepSeek研究者が主導した開発体制も注目点

#### 情報ソース

[[ogp:https://www.mi.com/jp/|https://i01.appmifile.com/webfile/globalimg/mobile/logo/mi.png|Xiaomi公式サイト|小米日本公式サイトで最新のXiaomi 15T Pro、REDMI Pad 2 Pro、Xiaomi Watch S4などを特別価格で購入できます。スマートフォン、タブレット、ウェアラブルデバイスまで、豊富なラインアップを取り揃えています。今すぐチェック！|Xiaomi Japan]]

[[ogp:https://venturebeat.com/technology/xiaomi-stuns-with-new-mimo-v2-pro-llm-nearing-gpt-5-2-opus-4-6-performance|https://images.ctfassets.net/jdtwqhzvc2n1/2HCPXa9wmUn3GxH2G23n1k/a1081f11043cf47149b1d3533186679d/Gemini_Generated_Image_ovvcbfovvcbfovvc.png|Xiaomi stuns with new MiMo-V2-Pro LLM nearing GPT-5.2, Opus 4.6 performance at a fraction of the cost|MiMo-V2-Pro utilizes a 7:1 hybrid ratio (increased from 5:1 in the Flash version) to manage its massive 1M-token context window.|Venturebeat]]

[[ogp:https://www.labla.org/latest-ai-model-releases-past-24-hours/ai-model-releases-march-19-21-2026-the-48-hours-that-nobody-saw-coming/]]

[[ogp:https://openrouter.ai/xiaomi/mimo-v2-pro/benchmarks]]

[[ogp:https://artificialanalysis.ai/models/mimo-v2-pro|https://artificialanalysis.ai/img/open-graph/og-image.png|MiMo-V2-Pro - Intelligence, Performance & Price Analysis|Analysis of Xiaomi's MiMo-V2-Pro and comparison to other AI models across key metrics including quality, price, performance (tokens per second & time to first token), context window & more.|]]
