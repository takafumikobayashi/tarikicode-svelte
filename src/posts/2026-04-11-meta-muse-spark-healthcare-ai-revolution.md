---
title: 'MetaがAI競争に本格参戦──新世代主力モデル「Muse Spark」は初の非オープンウェイト、医療HealthBench 42.8でGPT-5.4超えの衝撃'
date: '2026-04-11'
category: 'AI'
tags: ['Meta', 'Muse Spark', 'LLM', '医療AI', 'マルチモーダル']
description: 'Meta Superintelligence Labsが2026年4月8日に「Muse Spark」を発表。frontier級主力モデルとして初の非オープンウェイトとしてHealthBench Hard 42.8でGPT-5.4(40.1)を上回る医療AI最強スコアを達成。思考圧縮技術でLlama 4比10倍の計算効率を実現。'
image: 'https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs-first-model-built-to-prioritize-people/'
featured: false
type: 'blog'
---

2026年4月8日、MetaはAI業界を震撼させる新モデル「**Muse Spark**」を発表した。Meta Superintelligence Labs（MSL）が9ヶ月をかけてゼロから再構築したこのモデルは、**Metaのfrontier級主力モデルとして初めて非オープンウェイト**という歴史的転換点を意味する。Llama路線で培ったオープンウェイト戦略から脱却し、GPT-5.4・Gemini 3.1 Proと真正面から戦う姿勢を鮮明にした。

### Metaが「本気」を示した背景

#### Scale AI創業者を招いた143億ドルの賭け

Muse Sparkの開発を率いたのは、Alexandr Wang──Scale AI創業者として知られる若きAIエンジニアだ。2025年後半、MetaはWangを迎え入れるために約143億ドル（$14.3B）規模の取引を行い、従来のLlamaチームを刷新してMeta Superintelligence Labsを新設した。

過去9ヶ月でMSLがAIスタックを土台から再構築した成果が、今回のMuse Sparkである。

#### なぜ今、オープンソースをやめたのか

Metaはこれまで、Llamaシリーズをオープンウェイトで公開することで開発者コミュニティに支持され、AI業界での存在感を確立してきた。しかし今回のMuse Sparkは**オープンウェイトではない**。この戦略転換について、MetaはOpenAI・Anthropicが独占してきた「フロンティアモデル」市場への本格参入を示すものだと説明している。

### Muse Spark の技術的特徴

#### マルチモーダル入力対応

Muse Sparkは音声・テキスト・画像の入力に対応するマルチモーダルモデルだ。現時点では出力はテキスト中心で、Meta AIアプリおよびmeta.aiから利用できる。

#### 「Contemplating（熟考）」モード

Muse Sparkには2つの動作モードがある：

- **高速モード**：日常的なクエリへの素早いレスポンス
- **Contemplatingモード**：複数のサブエージェントを並列で動かし、段階的な推論を行う「熟考」モード

このContemplatingモードが、医療や科学分野での高精度回答を実現している。

#### 高いトークン効率

Muse Sparkは推論時のトークン消費が少なく、トークン効率の高さが特徴として挙げられている。Artificial Analysisの評価によれば、Intelligence Index評価でのMuse Sparkの出力トークン数はGemini 3.1 Pro（5,700万）と同水準で、Claude Opus 4.6（1億5,700万）やGPT-5.4（1億2,000万）と比べて大幅に少ない。

| モデル | Intelligence Index評価での出力トークン数 |
|--------|----------------------------------------|
| Claude Opus 4.6 | 1億5,700万トークン |
| GPT-5.4 | 1億2,000万トークン |
| Gemini 3.1 Pro | 5,700万トークン |
| **Muse Spark** | **5,800万トークン** |

### ベンチマーク：得意分野と弱点

#### 総合ランキング

Artificial Analysis Intelligence Index v4.0（2026年4月時点）での総合スコア：

| モデル | スコア |
|--------|--------|
| Gemini 3.1 Pro | 57 |
| GPT-5.4 | 57 |
| Claude Opus 4.6 | 53 |
| **Muse Spark** | **52** |

#### HealthBench Hard：医療AIで圧倒的1位

Muse Sparkが最も際立つ強みを発揮したのが**HealthBench Hard**──1,000件のオープンエンド医療クエリからなる難関ベンチマークだ。

| モデル | HealthBench Hard スコア |
|--------|------------------------|
| **Muse Spark** | **42.8** 🥇 |
| GPT-5.4 | 40.1 |
| Gemini 3.1 Pro | 20.6 |
| Grok 4.2 | 20.3 |
| Claude Opus 4.6 Max | 14.8 |

Gemini 3.1 Proの**2倍超**、Claude Opus 4.6の**約3倍**というスコアは衝撃的だ。Metaは医師チームと協力してトレーニングデータをキュレーションしており、医療分野への本気度が数字に表れている。

#### 弱点：抽象推論とコーディング

一方、苦手分野も明確だ。Artificial Analysisの評価によれば、エージェント的パフォーマンスは他のフロンティアモデルと比べて突出しておらず、コーディングベンチマーク（TerminalBench Hard）でもClaude Sonnet 4.6・GPT-5.4・Gemini 3.1 Proに劣後している。抽象推論やコーディングでは、現時点で他の最上位モデルに見劣りする側面がある。

### 利用方法と価格

#### 現在のアクセス手段

Muse Sparkは現時点では**無料**で利用できる（ただし将来的なレート制限の可能性をMetaは否定していない）：

- **Meta AIアプリ**（iOS/Android）
- **meta.ai**（ウェブブラウザ）
- 数週間以内にFacebook・Instagram・WhatsApp・Messengerへ展開予定

4月8日時点ではまず米国で提供を開始しており、他地域への拡大も予告されている。

#### API：一般公開は未提供、選定パートナーにはprivate preview

一般向けAPIは現時点で未提供だが、Metaは選定パートナー向けにprivate previewでAPIアクセスを提供している。一般公開の価格や時期は明かされていない。競合との価格比較：

| モデル | 入力（per 1M tokens） | 出力（per 1M tokens） |
|--------|----------------------|----------------------|
| **Muse Spark** | **未定（現時点では無料）** | **未定（現時点では無料）** |
| Gemini 3.1 Pro | $2.00 | $12.00 |
| GPT-5.4 | $2.50 | $20.00 |
| Claude Opus 4.6 | $5.00 | $25.00 |

### 業界への影響

#### AI競争の構図が変わる

これまでのAI競争は「OpenAI vs Anthropic vs Google」の三つ巴だった。Metaはオープンソース路線でその外側に位置していたが、Muse Sparkの登場でその構図が崩れた。

35億人規模のユーザーを抱えるFacebook・Instagram・WhatsAppへの展開が始まれば、Muse Sparkは一夜にして**世界最大規模のAIデプロイメント**になり得る。

#### 医療AI市場へのインパクト

HealthBench Hardでの圧倒的1位は、医療業界に対するMetaの明確なシグナルだ。電子カルテ、医師向け診断支援、患者向け健康情報サービスなど、医療AIの主要な応用領域でMuse Sparkが競合を大幅に上回る性能を示した意味は大きい。

### まとめ

- **Metaがfrontier級主力モデルとして初めて非オープンウェイトのMuse Sparkを4月8日に発表、Llama路線から脱却**
- **HealthBench Hard 42.8でGPT-5.4（40.1）を上回り、医療AI最強モデルの座を獲得**
- 「Contemplatingモード」（並列サブエージェント推論）と高いトークン効率が技術的特徴
- 総合ベンチマークでは上位グループ（スコア52）でGemini 3.1 Pro・GPT-5.4・Claude Opus 4.6に次ぐ水準。抽象推論とコーディングは相対的に弱く、現時点での課題
- 4月8日時点で米国から提供開始・他地域拡大も予告。一般向けAPI未提供（選定パートナー向けprivate previewは提供中）。Metaの35億人規模ユーザー基盤への展開が始まれば市場構造が一変する可能性

**情報ソース：**

[[ogp:https://about.fb.com/news/2026/04/introducing-muse-spark-meta-superintelligence-labs-first-model-built-to-prioritize-people/]]

[[ogp:https://www.cnbc.com/2026/04/08/meta-debuts-first-major-ai-model-since-14-billion-deal-to-bring-in-alexandr-wang.html]]

[[ogp:https://artificialanalysis.ai/articles/muse-spark-everything-you-need-to-know]]

[[ogp:https://www.marktechpost.com/2026/04/09/meta-superintelligence-lab-releases-muse-spark-a-multimodal-reasoning-model-with-thought-compression-and-parallel-agents/]]
