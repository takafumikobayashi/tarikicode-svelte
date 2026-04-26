---
title: 'OpenClawが「AIのLinux」へ──250,000スター超で史上最速バイラル、NVIDIA GTC 2026でNemoClaw企業版を発表も深刻なセキュリティ危機'
date: '2026-03-22'
category: 'AI'
tags: ['OpenClaw', 'NVIDIA', 'AIエージェント', 'セキュリティ', 'GTC2026']
description: 'オープンソースAIエージェントOpenClawがGitHub 250,000スター超え。Jensen Huang が「AIのOS」と表現した一方、CVE-2026-25253や800件超の悪意スキルなどセキュリティ危機も深刻化。NVIDIAがGTC 2026でNemoClawを発表。'
image: 'https://iprsoftwaremedia.com/219/files/202603/69b845e73d63326d1774de06_nemoclaw/nemoclaw_e0885d14-de1f-4b46-8fda-e6afe51ff6e2-prv.jpg'
featured: false
type: 'blog'
---

### OpenClawが「AIのLinux」へ──250,000スター超で史上最速バイラル、NVIDIA GTC 2026でNemoClaw企業版を発表も深刻なセキュリティ危機

NVIDIA GTC 2026（サンノゼ、3月16〜19日）の基調講演で、CEOのJensen HuangはOpenClawを「パーソナルAIのオペレーティングシステム」と表現した。複数の報道によれば「史上最も重要なソフトウェアリリース」とも評したとされるが、この表現はNVIDIA公式プレスリリースには確認できないため、二次報道ベースとして参照されたい。Huangが指していたのは自社の新チップではなく、オーストリア人開発者が個人プロジェクトとして始めたオープンソースAIエージェント「**OpenClaw**」だ。

NVIDIAは公式に「史上最速で成長したオープンソースプロジェクト」と表現し、Jensen HuangもGTC講演でLinux・Kubernetes・HTMLより速く成長したと述べた。その急速な普及と同時に、深刻なセキュリティリスクも浮き彫りになっている。

### OpenClawとは何か

#### 誕生と急成長

OpenClawはオーストリアの開発者**Peter Steinberger**（PSPDFKit創業者、累計インストール数10億デバイス以上）が2025年11月に「**Clawd**」として公開したオープンソースのAIエージェントフレームワークだ。商標上の問題から「**Moltbot**」を経て、最終的に「OpenClaw」に落ち着いた。

その後わずか4ヶ月で以下を達成した：

| 指標                                | 内容                                    |
| ----------------------------------- | --------------------------------------- |
| GitHub成長速度                      | NVIDIA公式「史上最速のOSSプロジェクト」 |
| 比較対象（Huang発言）               | Linux・Kubernetes・HTMLより速く成長     |
| agentic AI市場規模（2026年3月時点） | $108.6億                                |

#### 何ができるのか

OpenClawはLLMをローカルで動作させ、実際のソフトウェアに接続する無料エージェントだ。従来のチャットbotと根本的に異なる点は、「**回答を返す**」のではなく「**タスクを実行する**」ことにある。

- ブラウザ操作・ファイル管理・APIコール
- メール送信・カレンダー管理・コード実行
- 100以上のビルトインスキルでアプリと連携
- LLMを選択して使用（クラウドもローカルも）

Jensen Huangはこれを「GPTがチャットbotに対してしたことを、OpenClawはエージェントに対してする」と表現した。

### NVIDIA GTC 2026：NemoClaw発表の意味

#### NemoClaw：「エンタープライズ版OpenClaw」

2026年3月16日、NVIDIAはGTC基調講演でOpenClawコミュニティ向けに**NemoClaw**を発表した。これはOpenClawの上にNVIDIAのソフトウェアスタックを重ねたエンタープライズ対応版だ。

| 機能                 | 内容                                                 |
| -------------------- | ---------------------------------------------------- |
| インストール         | 1コマンドで完結                                      |
| ランタイム           | OpenShell（プロセスレベルのサンドボックス化）        |
| プライバシー制御     | ポリシーベースのガバナンス・データ取り扱いルール     |
| ローカルモデル       | Nemotronオープンモデルをローカル実行                 |
| クラウド接続         | プライバシールーターでフロンティアモデルにも接続可能 |
| 動作確認ハードウェア | RTX PC、RTX PRO WS、DGX Station、DGX Spark など      |

JensenはNemoClaw発表時に「それがOpenClawを見つけ、ダウンロードし、AIエージェントを構築する」と説明した。

#### 「OpenClawは新しいLinux」

GTC会場でのHuangの言葉は強烈だった。彼はLinuxがかつてオープンな汎用コンピューティング基盤を提供したように、OpenClawがエージェントAIの基盤になると主張した。NvidiaのNemoClaw戦略は、Red HatがLinuxをエンタープライズ向けにパッケージ化したRHEL戦略と構造が重なる。

### セキュリティ危機：急成長の代償

しかし急速な普及は深刻なリスクも同時にもたらしている。

#### CVE-2026-25253：トークン流出・不正接続の重大脆弱性

OpenClawを直撃したのが**CVE-2026-25253**だ。NVDの記述によれば、クエリ文字列に含まれる `gatewayUrl` パラメータに自動接続し、トークン値を送信してしまう仕様上の問題であり、UIを経由した操作によってトークン流出や不正接続を引き起こし得る重大な脆弱性だ。

#### 露出インスタンスと「ClawHavoc」キャンペーン

複数のスキャンチームが認証なしでインターネットに露出したOpenClawインスタンスを確認しており、Bitsightは**3万超**、Hunt.ioは**1.75万超**を報告している。さらに「ClawHavoc」と名付けられたサプライチェーン攻撃が展開中だ。セキュリティベンダーの分析によれば、ClawHub（スキルレジストリ）上で悪意あるスキルが**数百件規模**で確認され、その後**800件超**に拡大したとの報告もある（主な悪意コード：Atomic macOS Stealer）。ただし800件超・約20%という具体数値はセキュリティベンダー系レポートによるものであり、一次公表での直接確認には至っていない。

#### Gartnerと中国の対応

Gartnerは「OpenClawはデフォルトでセキュアでない設計であり、エンタープライズ利用は受け入れられないリスクを伴う」と警告。Reutersの報道によれば、中国政府は2026年3月中旬、国家機関・国有企業のスタッフに対してOpenClawのインストールを控えるよう要請したとされる。

### 何を意味するか：エージェントAI時代の幕開けと課題

OpenClawの爆発的な普及は、AIが「会話するもの」から「実際に働くもの」へと移行した歴史的な瞬間を示している。一方でセキュリティ問題は、エージェントがPCやAPIに直接アクセスできる分、チャットbotとは次元の異なる被害を生じさせることも明らかにした。

NVIDIAがエンタープライズ版（NemoClaw）をアルファリリースとして提供開始したことは、この技術を「実験」から「業務利用」へ橋渡しする重要な一歩だ。ただしNvidiaも「Rough edges（荒削り）」を認めており、本格的な本番環境への展開には時間が必要だろう。

### まとめ

- **OpenClaw**は2025年11月生まれのOSSエージェントフレームワーク。NVIDIAが「史上最速のOSSプロジェクト」と公式に表現、Linux・Kubernetes・HTMLより速く成長（Huang発言）
- Jensen HuangはGTC 2026でOpenClawを「パーソナルAIのOS」と位置づけ（「史上最重要ソフトウェア」は二次報道ベース）、**NemoClaw**（エンタープライズ版）を発表（現在アルファ）
- NemoClawはシングルコマンドインストール、OpenShellサンドボックス、ポリシーベース制御でOpenClawのセキュリティ問題に対応
- 一方でCVE-2026-25253（トークン流出・不正接続、NVDベース）、Bitsightが報告した3万超の無認証公開インスタンス、ClawHubへの数百〜800件超規模の悪意スキル混入（セキュリティベンダー報告）など深刻なセキュリティ危機が進行中
- GartnerはOpenClawを「エンタープライズ利用には受け入れられないリスク」と警告。中国政府は国家機関・国有企業スタッフへの導入自粛を要請（Reuters報道）

これは単なるOSSの成功ではない。AIが「ソフトウェア」から「実行主体」へと変わり始めた象徴的な出来事である。

#### 情報ソース

[[ogp:https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw]]

[[ogp:https://www.fierce-network.com/broadband/nvidia-gtc-openclaw-new-linux-and-every-company-needs-strategy-says-jensen-huang|https://qtxasset.com/quartz/qcloud4/media/image/Nvidia%20Jensen%20Huang%20at%20GTC%202026.jpeg?VersionId=_cpWMgvhLVsORvVNzYz3h6WouBYsd8I3|Nvidia GTC: OpenClaw is the new Linux, says Jensen Huang|OpenClaw, an operating system for AI agents, has become the fastest-growing open source project in his - Nvidia's Jensen Huang said OpenClaw is the fastest-growing open source project in history and "every company in the world today needs to have an OpenClaw strategy."|Fierce Network]]

[[ogp:https://techcrunch.com/2026/03/16/nvidias-version-of-openclaw-could-solve-its-biggest-problem-security/]]

[[ogp:https://thenewstack.io/openclaw-github-stars-security/|https://cdn.thenewstack.io/media/2026/03/82d193e2-beatriz-camaleao-h52hez3-3vu-unsplash-scaled.jpg|OpenClaw rocks to GitHub's most-starred status, but is it safe?|OpenClaw surpasses Linux and React as GitHub's most-starred project. Security experts warn its agentic AI architecture poses enterprise risks without controls.|The New Stack]]
