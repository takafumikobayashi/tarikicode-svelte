---
title: 'FLUX 3登場：Black Forest Labsが動画・音声・ロボット制御を統合するマルチモーダル基盤モデルを発表、Audiの工場で実タスク検証へ'
date: '2026-07-26'
category: 'AI'
tags: ['Black Forest Labs', 'FLUX 3', 'マルチモーダルAI', '動画生成AI', 'ロボティクス']
description: '画像生成モデルFLUXで知られるBlack Forest Labsが2026年7月23日、画像・動画・音声を単一アーキテクチャで学習する新モデル「FLUX 3」を発表。ロボット制御にも拡張でき、提携先mimic roboticsとの実装がAudiの工場で実際の生産タスクを対象にテスト・展開されている。'
image: 'https://bfl.ai/blog/flux-3'
featured: false
type: 'blog'
---

### はじめに

画像生成モデル「FLUX」シリーズで知られるBlack Forest Labs（BFL）が2026年7月23日、新モデル「FLUX 3」を発表しました。これまでのFLUXが画像生成に特化していたのに対し、FLUX 3は画像・動画・音声を単一アーキテクチャで同時に学習する、同社初のマルチモーダル基盤モデルです。

さらに注目すべきは、このアーキテクチャがロボットの行動予測にまで拡張できる点です。ロボティクス企業mimicとの共同開発モデル「FLUX-mimic」は、すでにAudiの工場で、実際の生産・組立タスクを対象にテストと展開が進められています。動画生成AIの発表が続く中、コンテンツ生成と物理世界の行動制御を同じ基盤モデルで扱うという主張は、この分野では珍しい方向性です。

本記事はBFL公式ブログ（flux-3、flux-3-mimic）と、BFL・mimic両社のプレスリリースを一次ソースとして、スペック・ベンチマーク・ロボティクス応用を整理します。

### 基本スペック

| 項目                               | 内容                                                                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| モダリティ                         | 画像・動画・音声を単一アーキテクチャで同時学習（言語で指示）                                                                         |
| アーキテクチャ                     | Self-Flow（マルチモーダルflow matching。BFLの比較チャートでは通常のFlow Matchingより生成誤差が低く、操作タスクの成功率も高いと報告） |
| 動画生成                           | 音声込みで最大20秒を単一生成。効果音・環境音・多言語セリフも画面と同期して生成される                                                 |
| バリエーション                     | FLUX 3 Video（動画） / FLUX 3 Image（画像） / FLUX 3 Action（行動予測） / FLUX 3 Dev（オープンウェイト予定）                         |
| 提供状況                           | Video：Early Access開始／Image：数週間以内に提供予定／Action：mimic roboticsなど選定パートナー限定／Dev：時期未定                    |
| 価格                               | 全ティアとも未発表                                                                                                                   |
| 先行テスター（プレスリリース記載） | Canva、Burda、Magnific（旧Freepik）、Krea、Picsart                                                                                   |

先行テスターの5社は、BFLが2026年7月23日に配信したプレスリリースに「FLUX 3 is already being tested by Canva, Burda, Magnific (formerly Freepik), Krea, and Picsart.」と記載されているものです。公式ブログ本文にはこの列挙はないため、出典の性質が他の項目とは異なります。なおMagnificは、Freepikが2026年4月にブランド名を変更した後の社名です。

### ベンチマーク：動画生成で高い選好率も、自社は「暫定的」と明記

BFL公式ブログでは、10秒・720pのテキスト動画生成を人間評価者に比較させた結果として、以下の選好率を公開しています。

| 比較対象           | FLUX 3の選好率 |
| ------------------ | -------------- |
| Luma Ray 3.2       | 93%            |
| Runway Gen-4.5     | 77%            |
| Grok Imagine Video | 最大69%        |
| Kling v3 Pro       | 60%            |
| Happy Horse v1     | 59%            |
| Happy Horse 1.1    | 57%            |
| Seedance 2.0       | 52%            |
| Gemini Omni Flash  | 52%            |

この数字だけを見るとFLUX 3が動画生成AI市場のほぼ全方位で優勢に見えますが、**BFL自身が「モデルとその周辺のハーネスがまだ開発中であるため、これらの結果は暫定的（preliminary）である」と公式ブログで明記しています**。評価手法やサンプル数も公開されておらず、本記事執筆時点で公表された第三者の独立検証は確認できないため、参考値として扱うのが妥当です。

### ロボティクスへの拡張：FLUX-mimicがAudiの実生産タスクでテスト・展開

FLUX 3の設計上の特徴は、画像・動画・音声を同時学習させることで「各モダリティが互いを補強し合う」という考え方にあります。BFLはこの枠組みをロボットの行動予測にまで広げ、ロボティクス企業mimicと共同で「FLUX-mimic」を開発しました。

技術面での主な数値は以下の通りです。

BFL公式ブログ（flux-3-mimic）より：

- バックボーン単体の推論は、NVIDIA RTX 5090 1枚で80ミリ秒未満
- ロボットシステム全体としての反応時間は101ミリ秒
- Self-Flowなしの動画モデルに比べ、行動予測の目標成功率到達に必要な学習ステップが半分
- mimic-video論文の報告として、既存のvision-language-actionモデル比で最大10倍のサンプル効率

BFL・mimic両社のプレスリリース（2026年7月23日）より：

- タスクの難易度によっては、**わずか30分程度のロボットデータでファインチューニングが可能**。従来手法では30時間以上を要していたとされる
- これにより、導入サイクルが数か月単位から数週間単位に短縮されると両社は説明

FLUX-mimicはAudiの工場で、部品のキッティング、電子制御ユニットの精密挿入、部品組み立て、シール材やケーブルなど柔らかい素材の取り扱いといった実際の生産・物流タスクを対象に、テストと展開が進められています。AudiのChristoph Schneider氏（Production Lab）は公式発表で次のようにコメントしています。

> 「mimicとの提携により、Audiは複雑なソフトボディ操作作業を、従来のロボット工学では単純に不可能だった水準で解決するロボットをテスト・展開してきた」

### 注意点

- ベンチマークの選好率（77%・93%など）はBFLが「暫定的」と自認する自社評価であり、手法・サンプル数は非公開。少なくとも主要な第三者評価は、執筆時点でまだ公表されていない
- 全ティアとも価格が未発表で、コスト試算はまだできない
- 一般提供されているのはVideoのEarly Accessのみ。Imageは「数週間以内」、Actionは限定パートナー、オープンウェイト版のDevは時期未定
- ロボティクスの成果（反応時間101ミリ秒、学習効率10倍、30分のデータでのファインチューニングなど）もBFL・mimic側の発表数値であり、独立した検証結果ではない。特に「30分」はタスクの難易度次第という条件付きの数字

### まとめ

- Black Forest Labsが2026年7月23日、画像・動画・音声を同一アーキテクチャで学習する初のマルチモーダル基盤モデル「FLUX 3」を発表
- 動画は音声込みで最大20秒を単一生成。BFL公式評価ではRunway Gen-4.5に77%、Luma Ray 3.2に93%の選好率を主張するが、自社が「モデルもハーネスも開発中のため暫定的」と位置づけており、公表された独立検証は執筆時点で確認できない
- 同じSelf-Flowアーキテクチャをロボットの行動予測に拡張した「FLUX-mimic」（mimic roboticsと共同開発）が、Audiの工場で部品組み立てなど実際の生産タスクを対象にテスト・展開されている（全面的な量産導入の完了ではない点に注意）
- 反応時間101ミリ秒、学習効率10倍、条件次第で30分のロボットデータによるファインチューニング（従来は30時間以上）などの成果が報告されているが、いずれもBFL・mimic側の発表値
- 提供状況はVideoがEarly Accessのみで、価格・Image・オープンウェイト版（Dev）はいずれも未確定。実運用コストの評価は現時点では時期尚早

**情報ソース：**

[[ogp:https://bfl.ai/blog/flux-3]]

[[ogp:https://bfl.ai/blog/flux-3-mimic]]

[[ogp:https://www.globenewswire.com/news-release/2026/07/23/3332364/0/en/black-forest-labs-unveils-flux-3-a-new-multimodal-frontier-model-for-visual-intelligence.html]]

[[ogp:https://www.bloomberg.com/news/articles/2026-07-23/black-forest-labs-unveils-first-model-for-robotics-in-shift-to-physical-ai]]

[[ogp:https://venturebeat.com/technology/black-forest-labs-launches-flux-3-capable-of-generating-images-and-20-second-video-with-audio-but-in-limited-release-to-start|https://images.ctfassets.net/jdtwqhzvc2n1/1jXsrdqmpOmNlLZrXsL3hC/d83b416f6a0db2e9b871428ed55b2c2a/image__85___1_.png|Black Forest Labs launches FLUX 3 capable of generating images and 20-second video with audio — but in limited release to start|FLUX 3 is jointly trained across those modalities rather than assembling separate image, video and audio models behind a common interface.|VentureBeat]]
