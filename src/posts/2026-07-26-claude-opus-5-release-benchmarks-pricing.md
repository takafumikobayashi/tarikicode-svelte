---
title: 'Claude Opus 5登場：IMO 2026で42点満点の金メダル級、SWE-bench Verified 96.0%をFable 5の半額で'
date: '2026-07-26'
category: 'AI'
tags: ['Anthropic', 'Claude Opus 5', 'LLM', 'エージェント', 'ベンチマーク']
description: 'Anthropicが2026年7月24日、Claude Opus 5を公開。入力100万トークン5ドルとFable 5の半額に据え置きつつ、SWE-bench Verified 96.0%、IMO 2026で42点満点を記録。System Cardの数値から実力と弱点を検証する。'
image: 'https://www.anthropic.com/news/claude-opus-5'
featured: true
type: 'blog'
---

### はじめに

Anthropicが2026年7月24日、Opus系列の新モデル「Claude Opus 5」を公開しました。前世代のOpus 4.8から価格を据え置いたまま、エージェント的なコーディング、コンピュータ操作、長時間の知的作業で性能を伸ばしたと位置づけられています。

価格面で目を引くのは、上位のClaude Fable 5が入力100万トークンあたり10ドル・出力50ドルであるのに対し、Opus 5は入力5ドル・出力25ドルという点です（いずれもAnthropic公式APIの標準レート）。同社は公式発表で、コーディング評価CursorBench 3.2において「Fable 5の最高スコアと0.5%以内の差を、タスクあたり半分のコストで達成した」と説明しています。

一方で、System Cardを読むとOpus 5がすべてのベンチマークで首位というわけではありません。本記事はAnthropic公式発表とSystem Card（2026年7月24日公開・全193ページ）を一次ソースとして、実際の数値を確認します。

### 基本スペック

| 項目             | 内容                                                                                                                                                                  |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| モデルID         | `claude-opus-5`                                                                                                                                                       |
| 公開日           | 2026年7月24日                                                                                                                                                         |
| 価格             | 入力$5／出力$25（100万トークンあたり、標準API）                                                                                                                       |
| コンテキスト     | 100万トークン（既定値かつ最大値。小容量の派生版はなし）                                                                                                               |
| 最大出力         | 128kトークン                                                                                                                                                          |
| 知識のカットオフ | 2026年5月                                                                                                                                                             |
| 推論設定         | effortを5段階（low／medium／high／xhigh／max）で調整可能                                                                                                              |
| 高速モード       | 出力トークン速度が最大約2.5倍。料金は基本の2倍（入力$10／出力$50）。Claude API（Claude Managed Agentsを含む）とClaude Code（usage credits経由）で提供。研究プレビュー |
| 提供先           | Claude.ai、Claude Code、Claude Cowork／Claude API（`claude-opus-5`）、Amazon Bedrock（`anthropic.claude-opus-5`）、Google Cloud（`claude-opus-5`）、Microsoft Foundry |

推論の深さを指定するeffortパラメータは、コストと知能のトレードオフを利用者側で選べる仕組みです。System Cardには後述のFrontierBenchでの内訳が記載されており、**xhighの平均報酬44.4%に対し、highは出力トークンが平均19%少なく平均報酬39%、lowは出力トークンが平均64%少なく平均報酬25%**とされています。

### ベンチマーク：エージェント系で大幅な伸び、ただし全勝ではない

System CardのTable 8.1.Aから主要な数値を抜き出します（Opus 5は特記なき限りadaptive thinking・max effort、5回試行の平均）。

| ベンチマーク           | Opus 5       | Opus 4.8 | Fable 5 | GPT-5.6 Sol |
| ---------------------- | ------------ | -------- | ------- | ----------- |
| SWE-bench Pro          | 79.2         | 69.2     | 80      | 64.6        |
| SWE-bench Multilingual | 89.5         | 84.4     | 86.6    | —           |
| SWE-bench Multimodal   | 59.4         | 38.4     | 54.1    | —           |
| DeepSWE v1.1           | 68.8         | 59.0     | 69.7    | 72.7        |
| OSWorld 2.0            | 70.6         | 55.7     | 66.1    | 62.6        |
| AutomationBench        | 26.0         | 17.0     | 17.4    | 18.1        |
| ARC-AGI-2              | 90.4         | 72.1     | —       | 92.5        |
| ARC-AGI-3              | 30.2（high） | 1.5      | —       | 7.8         |

このほかSWE-bench Verifiedでは96.0%を記録しています（500問、5回試行の平均）。

数字を見ると、Opus 5の伸びが際立つのは画面操作やツール連携といったエージェント領域です。コンピュータ操作を評価するOSWorld 2.0はOpus 4.8の55.7から70.6へ、Zapier製のAutomationBenchは17.0から26.0へ伸びています。視覚情報を含むSWE-bench Multimodalも38.4から59.4と大きく改善しました。抽象推論のARC-AGI-3にいたっては、Opus 4.8の1.5から30.2へと桁が変わっています。

**一方で、Opus 5が全項目で首位というわけではありません**。SWE-bench ProではFable 5の80.0がわずかに上回り、DeepSWE v1.1ではGPT-5.6 Solの72.7とFable 5の69.7がOpus 5の68.8を上回ります。ARC-AGI-2もGPT-5.6 Solが92.5で上回っています。Anthropic自身も、サイバー攻撃の悪用可能性に関する評価ではMythos 5に及ばないと明記しています。

### FrontierBench：Opus 4.8比で2.4倍、安全性分類器の作動率にも差

Terminal-Bench 2.1の後継として同じチームが開発したFrontierBench v0.1は、計算生物学・物理シミュレーション・CAD・形式証明・GPU最適化など74タスクからなる難易度の高い評価です。System Cardの数値は以下の通りです。

| モデル      | 平均報酬 | 設定  |
| ----------- | -------- | ----- |
| Opus 5      | 44.4%    | xhigh |
| GPT-5.6 Sol | 37.5%    | max   |
| Fable 5     | 33.7%    | max   |
| Opus 4.8    | 18.7%    | —     |
| Sonnet 5    | 17%      | —     |

Opus 4.8の18.7%に対して44.4%と、2.4倍近い開きがあります。Anthropicが公式発表で「Opus 4.8の性能を2倍以上に」と述べているのはこの評価を指したものです。

この節にはもう一つ、実務者にとって見逃せない記述があります。**この科学・工学タスク群で、安全性分類器が作動してOpus 4.8へフォールバックした割合は、Opus 5がAPIコールの5%（全試行の4%）だったのに対し、Fable 5は42%（同26%）に達した**という報告です。GPT-5.6 Solはこの評価で分類器が作動せず、フォールバック先の設定も不要だったと記載されています。

ここで注意したいのは、System Cardがこの42%を「誤検知」と認定しているわけではない点です。記録されているのはあくまで分類器の作動とフォールバックの発生頻度であり、内訳の妥当性までは判定されていません。

ただし関連する変更として、System CardはOpus 5の安全策がFable 5と同等である一方、ソースコードに対する脆弱性発見を全アクセスレベルで許可する点を変えたと説明しています。Anthropicはこの方針変更について、セキュアコーディング、既知脆弱性へのパッチ適用、インシデント対応といった防御的タスクでの「誤検知（false positives）を減らせる」と明記しており、実測でもOpus 5はFable 5よりこれら防御的コーディングタスクのブロック率が大幅に低かったとしています。

### IMO 2026で42点満点

2026年7月15〜16日に開催された国際数学オリンピック（IMO）の問題を、エージェントもツールも使わない状態で解かせた評価も収録されています。

Opus 5は6問それぞれに4通りの独立解答を生成しました。**この24解答すべてが、Gemini 3.1 Pro・Claude Opus 4.6・Claude Mythos Previewの3モデルによる合議採点（3者一致で初めて正解扱い）で正解と判定されています**。人間の専門家が採点したのは全24解答ではなく、各問につき事前に指定された1解答（各問の1本目、計6解答）で、こちらもすべて7点満点でした。最終スコアは42点満点の42点で、2026年の金メダル基準である29点を大きく上回っています。

ただし、出力上限を256,000トークンに設定し、上限に達した解答はより低いeffortで再サンプリングしたこと（1問で実施）も明記されています。競技会本番と同一条件の記録ではない点は押さえておく必要があります。

### 注意点

- ベンチマークはAnthropic自身による測定です。競合モデルのスコアは各社のSystem Cardや公開リーダーボードから引用したと注記されています
- SWE-bench Pro・DeepSWE v1.1・ARC-AGI-2ではFable 5やGPT-5.6 Solが上回っており、用途によって最適なモデルは変わります
- IMOの42点満点は、出力上限256,000トークン・再サンプリングありという条件下での結果です
- 高速モードは出力トークン速度（OTPS）が最大約2.5倍になる一方、料金は2倍（入力$10／出力$50）です。速くなるのは出力の生成速度であり、最初のトークンが返るまでの時間（TTFT）の短縮は対象外だとAnthropicは明記しています。モデル自体は同一で、知能や能力は変わりません
- 高速モードはClaude API（Claude Managed Agentsを含む）で提供され、Amazon Bedrock・Google Cloud・Microsoft Foundry・Claude Platform on AWSでは現時点で利用できません
- Claude CodeでもOpus 5の高速モードを利用できますが（`/fast`で切り替え、v2.1.219以降は高速モードの既定モデル）、利用はusage credits経由に限られ、プラン込みの利用枠には含まれません。usage creditsの有効化が前提で、Team・Enterpriseでは管理者による有効化も必要です。VS Code拡張は非対応です
- 高速モードはいずれも研究プレビュー段階です。API側の利用にはアカウントマネージャーへの申請かウェイトリスト登録が必要とAnthropicは案内しており、Batch APIやPriority Tierとの併用も不可です
- サイバー攻撃の悪用に関わる能力ではMythos 5に及ばないとAnthropicは説明しています

### まとめ

- Anthropicが2026年7月24日にClaude Opus 5を公開。価格はOpus 4.8から据え置きの入力$5／出力$25で、Fable 5（$10／$50）の半額
- SWE-bench Verified 96.0%、OSWorld 2.0で70.6、AutomationBenchで26.0を記録し、画面操作・ツール連携といったエージェント領域の伸びが顕著
- FrontierBench v0.1は44.4%でOpus 4.8の18.7%から2.4倍近い改善。同評価で安全性分類器が作動しフォールバックした割合はOpus 5が5%、Fable 5が42%と差が出た（内訳が誤検知かどうかまでは判定されていない）
- IMO 2026の6問すべてで42点満点（金メダル基準は29点）。ただし出力上限256,000トークン・一部再サンプリングという条件付き
- SWE-bench ProではFable 5、DeepSWE v1.1とARC-AGI-2ではGPT-5.6 Solが上回っており、「全ベンチマークで最強」ではない点は正確に押さえるべき

**情報ソース：**

[[ogp:https://www.anthropic.com/news/claude-opus-5]]

[[ogp:https://www-cdn.anthropic.com/c5fbac3f0b1280a933ebd26d3cb8bb9f5bdeaf48/Claude%20Opus%205%20System%20Card.pdf||Claude Opus 5 System
  Card|Anthropicの技術文書（PDF・193ページ）|anthropic.com]]

[[ogp:https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5]]

[[ogp:https://platform.claude.com/docs/en/build-with-claude/fast-mode|https://platform.claude.com/docs/og?locale=en&amp;path=build-with-claude/fast-mode&amp;design-rev=1|Fast mode (research preview)|Get up to 2.5x higher output tokens per second from supported Claude Opus models.|Claude Platform Docs]]

[[ogp:https://code.claude.com/docs/en/fast-mode]]

[[ogp:https://fortune.com/2026/07/24/anthropic-debuts-claude-opus-5-with-feature-that-lets-users-toggle-between-cost-and-capability/]]

[[ogp:https://www.marktechpost.com/2026/07/24/meet-the-new-claude-opus-5-frontier-class-agentic-coding-and-computer-use-at-unchanged-opus-pricing/]]
