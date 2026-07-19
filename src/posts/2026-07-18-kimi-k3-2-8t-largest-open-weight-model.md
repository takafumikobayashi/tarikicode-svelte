---
title: 'Kimi K3登場：2.8兆パラメータ"史上最大のオープンモデル"がOpus 4.8級をSonnet 5価格で狙う'
date: '2026-07-18'
category: 'AI'
tags: ['Kimi', 'Moonshot AI', 'オープンソースLLM', 'LLM', 'AIエージェント']
description: 'Moonshot AIが2026年7月16日に発表したKimi K3を検証。2.8兆パラメータ・1Mコンテキストの史上最大級オープンウェイトモデルは、自己申告でOpus 4.8超え、価格はSonnet 5と同水準の$3/$15。7月27日までの重み公開予告と注意点も整理する。'
image: 'https://kimi-file.moonshot.cn/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs7176rtp4tqfofnsg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_1440'
featured: true
type: 'blog'
---

### はじめに

2026年7月16日、中国のAIスタートアップMoonshot AI（月之暗面）は、新しいフラッグシップモデル「Kimi K3」を発表しました。総パラメータ数は2.8兆。同社はこれを「初のオープン3Tクラスモデル」と位置づけており、公約通り7月27日までに重みが公開されれば、DeepSeek-V4-Pro（1.6兆）を抜き、**公表済みのオープンウェイトモデルとして最大規模**になる見込みです。

発表時点ではKimi.com、Kimi Work、Kimi Code、Kimi APIで利用可能で、重み公開は「7月27日まで」と予告されている段階です。つまり現時点では「オープンウェイト予定のクローズドモデル」であることには注意が必要です。

本記事では、Moonshot公式ブログ（kimi.com/blog/kimi-k3）を一次ソースとして、スペック・価格・ベンチマークを検証します。ベンチマークの多くはMoonshotの自己申告値であるため、独立評価機関Artificial Analysisの測定値と分けて整理します。

### 基本スペック

| 項目                   | 内容                                                       |
| ---------------------- | ---------------------------------------------------------- |
| 総パラメータ数         | 2.8兆（Mixture-of-Experts）                                |
| エキスパート構成       | 896エキスパート中16をアクティブ化（Stable LatentMoE）      |
| コンテキストウィンドウ | 1Mトークン                                                 |
| モダリティ             | ネイティブビジョン対応（テキスト・画像・動画）             |
| 推論制御               | 発表時点では`max`のみ                                      |
| 提供チャネル           | Kimi.com、Kimi Work、Kimi Code（CLI）、API、モバイルアプリ |
| 重み公開               | 2026年7月27日までに公開予定                                |

アーキテクチャ面では、系列方向の情報の流れを改善するKimi Delta Attention（KDA）と、深さ方向の情報の流れを改善するAttention Residuals（AttnRes）という2つの更新が導入されました。これらとMoEの高疎性化に加え、訓練手法とデータレシピを改善することで、Kimi K2比で**約2.5倍のスケーリング効率**を実現したと説明しています。さらにSFT段階から量子化対応訓練（quantization-aware training）を採用し、重みをMXFP4、アクティベーションをMXFP8で扱う設計を取り入れています。2.8兆という規模を現実的な推論コストで動かすための工夫が、訓練段階から織り込まれている設計です。

### 価格：入力$3・出力$15はSonnet 5と同水準

公式発表のAPI価格は、100万トークンあたりキャッシュヒット入力$0.30・通常入力$3.00・出力$15.00です。主要モデルの標準API価格と並べると次のようになります（いずれも標準API・100万トークンあたり。Sonnet 5のみ2026年8月31日まで導入価格$2/$10が適用され、表には標準価格を記載）。

| モデル          | 入力  | 出力   |
| --------------- | ----- | ------ |
| Kimi K3         | $3.00 | $15.00 |
| Claude Sonnet 5 | $3.00 | $15.00 |
| Claude Opus 4.8 | $5.00 | $25.00 |
| Grok 4.5        | $2.00 | $6.00  |

前世代のKimi K2.6が入力$0.95・出力$4だったことを考えると、3倍超の値上げです。「オープンモデルだから安い」という従来の図式から離れ、**Sonnet 5と同じ価格でOpus 4.8級に近い性能を訴求する**という強気の値付けに変わりました。なおMoonshotは、コーディングワークロードではキャッシュヒット率が90%を超えるとしており、その場合の実効入力単価は$0.30に近づきます。

### 自己申告ベンチマーク：Opus 4.8超え、Fable 5には届かず

Moonshotが公表した主要スコア（いずれも推論effort `max`での自己申告値）は以下の通りです。

| ベンチマーク            | Kimi K3 | 備考                                     |
| ----------------------- | ------- | ---------------------------------------- |
| GPQA Diamond            | 93.5%   | 公表時点でオープンウェイト系最高値の主張 |
| Terminal-Bench 2.1      | 88.3    | KimiCodeハーネス使用                     |
| BrowseComp              | 91.2%   | 300Kトークンでコンテキスト圧縮を発動     |
| Humanity's Last Exam    | 56.0    | ツール使用あり                           |
| MCP Atlas               | 84.2    | エージェントのツール利用評価             |

Moonshot自身の整理では、K3は複数の公表ベンチマークでClaude Opus 4.8（max）やGPT-5.5（high）を上回る一方、総合的にはClaude Fable 5とGPT-5.6 Solに届かない、という位置づけです。自社発表で最上位2モデルへの劣位を認めている点は、先日のGrok 4.5と同様に率直な部類です。

ただし読み方には毎回同じ注意が必要です。Terminal-Bench 2.1はハーネス依存が大きいベンチマークで、K3の88.3はKimiCodeハーネスでの値です。当ブログで扱った各社公表値（Grok 4.5が83.3、Anthropic公表でSonnet 5が80.4）とは実行条件が揃っていない可能性が高く、**この表の数字だけで序列を断定することはできません**。BrowseCompの91.2%も、300Kトークンでコンテキスト圧縮を行う運用込みの値であり、圧縮なしの1Mコンテキスト素通し実行では90.4%と公表されています。

### 独立評価：Intelligence Index 57でOpus 4.8・GPT-5.5と同格

独立評価機関Artificial Analysisの測定では、Kimi K3はIntelligence Indexで57を記録し、Claude Opus 4.8・GPT-5.5と同水準、Claude Fable 5とGPT-5.6 Solには届かない位置でした。自己申告の「Opus 4.8級」という主張が、第三者測定でもおおむね裏付けられた形です。

さらに象徴的なのがフロントエンド開発能力を競うFrontend Code Arenaで、K3はElo 1679で**Claude Fable 5を抜いて首位**に立ちました。K2.6の18位からの17ランクジャンプで、7つのフロントエンド領域のうち6つで1位を取っています。総合力ではFable 5に及ばないものの、特定領域では最上位クローズドモデルを上回る——オープン系モデルの「部分的追い抜き」が現実になったことを示すデータです。

### 中国オープンモデル勢の文脈：DeepSeek・GLMに続く「規模の勝負」

Kimi K3は、当ブログで扱ってきた中国発オープンモデルの系譜——DeepSeek-V4-Pro（1.6兆MoE・1Mコンテキスト）、GLM-5.2（コーディング特化オープンウェイト）——の延長線上にあります。ただし戦略は各社で分かれてきました。DeepSeekが価格破壊、GLMがコーディング特化だったのに対し、Moonshotは**規模と価格の両方でフロンティアに正面から挑む**選択をしています。

米国の対中半導体輸出規制が続く中で2.8兆パラメータのモデルを訓練・公開してきたこと自体、計算資源制約の回避と効率化（前述の2.5倍のスケーリング効率）が実を結んだ結果と報じられています。Reutersは今回の発表を、中国のオープンAIエコシステムが米国の先端モデルとの差を急速に縮めていることを示す動きと位置づけました。予告通り7月27日までに重みが公開されれば、企業や研究機関がOpus 4.8級に近い性能を持つモデルを自社環境で運用できる選択肢が生まれます。ただし、2.8兆パラメータという規模から、現実的に自社ホストできる組織は大規模な計算基盤を持つ企業・研究機関に限られそうです。一方、GLM-5.2の記事でも触れた通り、中国系モデルの業務利用ではデータ取り扱いポリシーとホスティング先の確認が引き続き前提条件です（重みを自社ホストする場合はこの懸念は大幅に軽減されます）。

### 注意点：推論トークン消費と「max固定」

現時点の制約として、以下の点が挙げられています。

- 推論effortが`max`のみで、浅い推論で安く済ませる選択肢がない（Simon Willison氏の指摘。同氏は推論トークン消費の多さから実効コストは表面単価より高くつくと評価）
- 重み公開は7月27日「まで」の予告であり、ライセンス条件は公開時まで未確定
- ベンチマークの大半が自己申告値で、第三者による再現検証はArtificial Analysis等の一部に限られる

とくに1点目は実務コストに直結します。単価がSonnet 5と同じでも、タスクあたりの消費トークンが多ければ実効コストは上回ります。Grok 4.5の記事で見た「1トークンいくらより1タスクいくら」の観点では、effort制御が入るまで慎重に見るべきポイントです。

### まとめ

- Kimi K3は2026年7月16日発表。2.8兆パラメータ（896エキスパート中16アクティブのMoE）・1Mコンテキスト・ネイティブビジョン対応で、重みは7月27日までに公開予定。実現すればDeepSeek-V4-Proを抜き、公表済みのオープンウェイトモデルとして最大規模になる見込み
- API価格は入力$3/出力$15とClaude Sonnet 5の標準価格と同水準。K2.6比3倍超の値上げで、「安さ」ではなく「Opus 4.8級に近い性能」を売りにする戦略転換
- 自己申告ベンチマークはGPQA Diamond 93.5%、BrowseComp 91.2%などでOpus 4.8（max）超えを主張しつつ、Fable 5とGPT-5.6 Solへの劣位は自認。独立評価のIntelligence Index 57もこの位置づけを裏付けた
- Frontend Code ArenaではElo 1679でFable 5を抜き首位。オープン系モデルによる特定領域での最上位モデル追い抜きが現実化
- 推論effortはmax固定で実効コストが単価以上にかさむ可能性があり、ライセンス条件も重み公開まで未確定。採用判断は重み公開後の内容を見てからが堅実

**情報ソース：**

[[ogp:https://www.kimi.com/blog/kimi-k3|https://kimi-file.moonshot.cn/prod-chat-kimi/kfs/4/2/2026-07-17/d9cs7176rtp4tqfofnsg?x-tos-process=image%2Fauto-orient%2C1%2Fstrip%2Fignore-error%2C1%2Fformat%2Cwebp%2Fresize%2Cw_480 480w]]

[[ogp:https://simonwillison.net/2026/Jul/16/kimi-k3/]]

[[ogp:https://www.cnbc.com/2026/07/17/moonshot-ai-kimi-k3-model-openai-anthropic-china.html]]

[[ogp:https://finance.yahoo.com/technology/ai/articles/chinas-moonshot-unveils-worlds-largest-020622030.html]]

[[ogp:https://venturebeat.com/technology/chinas-moonshot-ai-releases-kimi-k3-the-largest-open-source-model-ever-rivaling-top-u-s-systems|https://images.ctfassets.net/jdtwqhzvc2n1/lrqUsUJocTIEaPB4SrQse/e8773a218e398efc6759ca6044672f81/Nuneybits_Vector_art_of_red_code_tsunami_over_servers_fear_of_C_1894f89b-b074-4e21-a0de-2f9a46cfdd32.webp|Kimi K3 Tech Blog: Open Frontier Intelligence|Kimi K3 is the world's first open 3T-class model — frontier performance across coding, knowledge work, and reasoning, with native multimodality and 1M context.|VentureBeat]]
