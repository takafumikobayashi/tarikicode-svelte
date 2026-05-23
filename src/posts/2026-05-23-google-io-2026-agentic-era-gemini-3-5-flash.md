---
title: 'Google I/O 2026：Gemini 3.5 Flashが3.1 Proをベンチで凌駕、Antigravity 2.0でエージェント時代が本格化'
date: '2026-05-23'
category: 'AI Industry'
tags: ['Google', 'Gemini', 'AI Agent', 'Antigravity', 'Google I/O 2026']
description: 'Google I/O 2026でGemini 3.5 FlashがGA。Terminal-Bench 76.2%・MCP Atlas 83.6%で3.1 Proを上回り、Developer API価格は$1.50/$9。Antigravity 2.0とGemini Sparkでエージェント時代の幕が開いた1日を解説。'
image: 'https://blog.google/innovation-and-ai/sundar-pichai-io-2026/'
featured: true
type: 'blog'
---

### Google I/O 2026：Gemini 3.5 Flashが3.1 Proをベンチで凌駕、Antigravity 2.0でエージェント時代が本格化

2026年5月19日、Mountain ViewのShoreline AmphitheatreでスタートしたGoogle I/O 2026のキーノートは、これまでの「AIアシスタント＝対話型チャットボット」のフレームを正面から塗り替えた。Sundar Pichai CEOが冒頭で繰り返した「**Welcome to the agentic Gemini era**」というフレーズの通り、発表の中核はモデル単体の刷新ではなく、24時間自走するエージェントを支えるインフラ・モデル・開発体験のフルスタックだった。

特にデベロッパー視点で衝撃が大きいのは3点。(1) Gemini 3.5 Flashが旧フラッグシップGemini 3.1 Proをコーディング・エージェント系ベンチで明確に上回り、Gemini Developer APIで入力$1.50／出力$9（per 1M tokens）の価格設定でGA。(2) Antigravity 2.0が「Agent-first IDE」としてGemini CLIを置換し、複数エージェントを並列オーケストレーションするCLI／SDK／デスクトップアプリの三位一体に進化。(3) Gemini Sparkという24/7で動く"パーソナル従業員"が、Google AI Ultra（$100 / $200）向けにロールアウト。本稿では、この1日に起きたシフトを数字とともに整理する。

#### Gemini 3.5 Flash：旧Proをベンチで抜き去る"実行層"の決定版

最大の驚きは**Flashが旧Proを超えた**という事実そのものだ。半年前にリリースされたGemini 3.1 Proはコーディング・エージェント系で同年代のClaude Opus 4.7やGPT-5.5と肩を並べる存在だったが、Gemini 3.5 Flashはそれを上回るベンチマークスコアを出しつつ、他社フロンティアモデル比で出力トークン秒速4倍をGoogleが公式に主張している。

##### ベンチマーク比較

| ベンチマーク | Gemini 3.5 Flash | Gemini 3.1 Pro | 改善幅 |
| ------------- | ---------------- | -------------- | ------ |
| Terminal-Bench 2.1（エージェント） | 76.2% | 70.3% | +5.9pt |
| MCP Atlas（ツール使用） | 83.6% | 78.2% | +5.4pt |
| GDPval-AA（実務タスクElo） | 1656 | 1314 | +342 Elo |
| CharXiv Reasoning（マルチモーダル） | 84.2% | — | — |

Terminal-BenchとMCP Atlasは「エージェントが端末・外部ツールをどれだけ正確に操れるか」を測る指標で、ここでFlash世代がPro世代を抜いたという事実は、従来「Pro=計画・Flash=実行」だった役割分担が崩れたことを意味する。Pichaiは「ほぼすべてのベンチマークで3.5 Flashが3.1 Proを上回る」と明言した。

##### 価格設定（Gemini Developer API、per 1M tokens）

| モデル | 入力 | 出力 | コンテキスト |
| ------ | ---- | ---- | ------------ |
| Gemini 3.5 Flash（新） | $1.50 | $9 | 1M tokens |

Gemini 3.5 Flash のコスト試算で実務上ハマりやすいのが、**Gemini ファミリーには複数の課金チャネルが並存している**点だ。Gemini Developer API・Google Cloud Vertex AI・Agent Platform Preview など、API 種別・推論モード・課金体系ごとに表示価格は変わるため、「Gemini 3.5 Flash は 3.1 Pro より○○％安い」のような世代横断の単純比較はチャネルを揃えていないと意味を持たない。

実務的には、利用予定のチャネルを最初に固定し、その上で同一条件のpricingで世代間／他社モデルとの比較を組むのが安全だ。前掲の $1.50／$9 はあくまで Gemini Developer API のレートであり、Vertex AI や Agent Platform で運用する場合は別の料金表に当たる必要がある。

##### 公式の価格訴求は「同等クラスの他社モデルより半額未満」

Googleが Gemini 3.5 Flash の価格優位として打ち出しているのは、**"less than half the price of comparable frontier models"**――同等クラスの他社フロンティアモデルより半額未満、というメッセージだ。比較対象はあくまで同クラスの他社モデルであり、Gemini 3.1 Pro など Google 自社の旧世代モデルに対する半額を主張したものではない。

したがってGemini 3.5 Flash の位置付けは「Claude／GPT 系の同等クラスに対する価格×性能の対抗弾」と読むのが正確だ。Gemini 3.1 Pro との直接的なドル建て比較を行いたい場合は、自分が使う API 種別（Gemini Developer API なのか Vertex AI なのか）と推論モードを揃えた上で個別に見積もる必要がある。

ロードマップ面では、Gemini 3.5 Pro が「来月」に予告されており、「実行層は 3.5 Flash、思考層は 3.5 Pro」というレイヤード構成の完成形が約1か月後に整うことが見えている。今からエージェント設計に Gemini 系を採用するなら、Flash でプロトタイプ→Pro で重要パスを補強、というロードマップを前提に置きやすい。

##### 何が変わるのか

- エージェントの裏側がFlashで十分動く：Terminal-Bench/MCP Atlasのスコア改善は、「裏で何百回もツールを呼ぶエージェント」をFlash系モデルで回せる時代の到来を意味する
- 3.1 Proユーザーのアップグレード検討材料：ベンチで上回り・4倍速・1Mコンテキストという組み合わせは、API利用者にとって移行を検討する十分な理由（コスト比較は自分のAPI種別で要確認）
- Claude Haiku／GPT-5.5 mini相当の対抗弾：低レイテンシ・中位価格帯の競争は、AnthropicのHaiku 4.5やOpenAIのGPT-5.5 miniに対し直接的な圧力を与える

#### Antigravity 2.0：Gemini CLIを葬り、エージェントIDEへ昇格

Antigravity 2.0はI/O 2025で原型が披露された開発環境の正統進化版だが、今回の発表は事実上のCLI戦争への本格参戦宣言だった。Googleは旧来のGemini CLIユーザーにAntigravity CLIへの移行を呼びかけ、フロントエンドのデスクトップアプリ・ターミナルのCLI・拡張のSDKを統合した「Agent-first開発スイート」として再定義した。

##### 提供形態の三本柱

| コンポーネント | 概要 |
| -------------- | ---- |
| デスクトップアプリ | 複数エージェントの並列オーケストレーション、カスタムサブエージェント設計、バックグラウンドタスクのスケジューリング、ネイティブ音声コマンド |
| CLI（新規・Go製） | Gemini CLIをリプレース。「より速くレスポンシブ」とGoogleは主張 |
| SDK | カスタムエージェントを構築・配布するための開発キット。AI Studioのテンプレートからローカル環境にプロジェクトをエクスポート可能 |

加えて、Firebase・Android・Google AI Studioとのネイティブ統合により、AI Studioでプロトタイプしてローカルに引き継ぐワークフローがフルコンテキスト保持で完結する。Gemini 3.5 Flashの「12倍高速化された最適化版」がエージェントエンジンとして組み込まれているのもポイントだ。

##### 価格構造の変更

今回のI/Oで重要なのは、AI Ultra に新たに $100/月のティアが追加され、同時に既存の最上位 AI Ultra が $250 → $200 に値下げされたこと。つまり**AI Ultra は $100 と $200 の2段階構成**になった。Pro（$20）と合わせて整理すると以下の通り。

| プラン | 月額 | Antigravity 上限倍率（対Pro） | 位置付け |
| ------ | ---- | ----------------------------- | -------- |
| Google AI Pro | $20 | 1x（基準） | 個人開発者向け基本プラン |
| AI Ultra（新規追加・$100ティア） | $100 | 5x | Gemini Spark 利用可・中位ティア |
| AI Ultra（最上位ティア・値下げ） | $200（旧$250） | 20x | Gemini Spark 利用可・ヘビーユーザー向け |

ポイントを整理すると：

- AI Ultra の2段階化：これまで AI Ultra は単一の最上位ティアだったが、I/O 2026 で $100 の中位ティアが新設された。Pro と最上位 Ultra の間の価格ギャップが埋まり、$100 と $200 のどちらでも Gemini Spark を利用できる設計に
- 最上位 Ultra の $250 → $200 への値下げ：ヘビーユーザーには高すぎた最上位ティアが現実的な選択肢に。Cursor／Claude／GitHub Copilot のヘビーユーザー向けプランと真正面から競合する位置取り
- $20 Pro でもデスクトップ・CLI・SDK フルアクセス：上限が低いだけで機能差はなく、Cursor 月$20プラン・Claude Pro 月$20プラン・GitHub Copilot Pro 月$10プランと並んで「個人開発者向けエージェントIDEの相場」を確定させた

#### Gemini Spark：AI Ultra で動く"24/7のデジタル従業員"

もう一つの目玉がGemini Sparkだ。これは「タブを閉じたら止まる」従来のチャット型アシスタントとは性質が違う、**Google Cloud上の専用VMで常時稼働するパーソナルエージェント**である。

##### Sparkの基本仕様

- 稼働形態：ユーザー専用のGoogle Cloud VM上で24/7常時稼働
- 接続先：Gmail・Docs・Sheets・Slides（Workspace）に加え、MCP経由で複数のサードパーティツール（TechCrunch等の報道では Canva・OpenTable・Instacart 等を例示。Google 公式 blog は具体的なサービス数までは明言していない）
- 想定タスク：レストラン予約、Instacart発注、就寝中の受信箱整理・返信ドラフト、長期タスクの追跡
- 提供形態：Google AI Ultra（$100 / $200 両ティア）向けに提供。当面はUS限定ベータで AI Ultra 加入者から順次（公式は翌週開始予定とアナウンス）
- エンジン：Gemini 3.5 + Antigravityの組み合わせ

「寝ている間にメールの下書きを終えておく」という標語は、これまでの「AIに頼んでも結局自分で確認しないと進まない」体験を反転させる狙いがある。OpenAIが先月発表したWorkspace Agents、AnthropicのClaude Managed Agents（多エージェント・dreaming機能）と直接競合する位置付けだ。

#### TPU第8世代・Gemini Omni・トークン爆発

裏方の発表もインパクトが大きい。Pichaiは2つの数字でこの1年の変化を示した。

- 月間処理トークン：480兆（2025年5月）→ 3.2京（クアドリリオン）超（2026年5月）。YoY 7倍
- TPU第8世代：トレーニング向けTPU 8t（前世代比3倍の演算性能）、推論向けTPU 8i（電力性能2倍）の2チップ構成。学習は100万TPUを超えるスケールで並列実行

合わせて、Gemini Omni Flash（任意の入力モダリティから任意の出力モダリティを生成、まずは動画出力から）が発表され、Gemini・Google Flow・YouTube Shortsから利用可能になっている。Sora 2、Veo 3、Runway Gen-4との生成動画市場の競争は次のラウンドへ。

#### 競合各社との位置取り

##### ベンチマーク観点での主要モデル比較（2026年5月時点・公開情報ベース）

| モデル | Terminal-Bench | コンテキスト |
| ------ | -------------- | ------------ |
| Gemini 3.5 Flash | 76.2% | 1M |
| Gemini 3.1 Pro | 70.3% | 1M |
| Claude Opus 4.7 | 約78% | 1M |
| GPT-5.5（API） | 82.7% | 1M |

注：

- コンテキスト窓は各社公式に揃えた。Claude Opus 4.7 は Anthropic 公式で 1M context、GPT-5.5 API は OpenAI 公式で 1M context（Codex 版は 400K で別系統）
- 価格はモデルごとにAPI種別・推論モード・課金体系が異なるため、同一条件での横並びは成立しない。Gemini 3.5 Flash の Gemini Developer API レートは $1.50/$9（per 1M tokens）。Opus 4.7・GPT-5.5・Gemini 3.1 Pro とのコスト比較は、自分が使う API を揃えた上で個別に見積もるのが安全

ベンチマーク絶対値ではGPT-5.5（82.7%）・Opus 4.7（約78%）が依然として上位だが、**Flashが3.1 Pro世代のスコアを抜いたことで、レイヤード構成における"実行層の天井"が一段引き上がった**ことが本質的な変化だ。

#### まとめ

- Gemini 3.5 Flashが旧フラッグシップGemini 3.1 ProをTerminal-Bench 2.1（76.2%）・MCP Atlas（83.6%）・GDPval-AA（1656 Elo）で上回り、Gemini Developer APIで入力$1.50/出力$9（per 1M tokens）・他社フロンティアモデル比で出力4倍速としてGA。他世代との価格比較はAPI種別を揃える必要がある点に注意
- Antigravity 2.0がGemini CLIをGo製の新CLIで置換し、デスクトップアプリ・CLI・SDKを統合したAgent-first開発スイートとして登場。$20 Proで全機能、$100 Ultraで5倍上限、$250→$200に値下げした最上位で20倍上限
- Gemini SparkはGoogle AI Ultra（$100 / $200 両ティア）向けに提供される24/7常時稼働の専用VMエージェント。Workspace＋MCP 経由の複数サードパーティツールを横断
- TPU第8世代（8t訓練・8i推論）と月間処理トークン7倍増（480兆→3.2京）で、エージェント時代を支える計算基盤も同時にスケールアウト
- **「エージェント時代」の競争軸は、モデル単体の性能からエージェントを24/7で安く動かし続けるスタック全体にシフト**。Anthropic Claude Managed Agents・OpenAI Workspace Agentsとの三つ巴は次フェーズへ

**情報ソース：**

[[ogp:https://blog.google/innovation-and-ai/sundar-pichai-io-2026/]]

[[ogp:https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/]]

[[ogp:https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/]]

[[ogp:https://techcrunch.com/2026/05/19/google-launches-antigravity-2-0-with-an-updated-desktop-app-and-cli-tool-at-io-2026/]]

[[ogp:https://techcrunch.com/2026/05/19/google-introduces-gemini-spark-a-24-7-agentic-assistant-with-gmail-integration/]]
