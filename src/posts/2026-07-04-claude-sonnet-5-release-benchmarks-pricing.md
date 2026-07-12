---
title: 'Claude Sonnet 5登場：SWE-bench Verified 85.2%、標準価格据え置きでFree/Proの新デフォルトモデルに'
date: '2026-07-04'
category: 'AI'
tags: ['Claude', 'Anthropic', 'AIエージェント', 'LLM', 'Coding']
description: 'Anthropicが2026年6月30日に公開したClaude Sonnet 5は、SWE-bench Verified 85.2%を達成しFree/Proの標準モデルに採用。標準価格は据え置きのまま、エージェント性能をOpus級に近づけた変更点をシステムカードの一次データで検証する。'
image: 'https://www.anthropic.com/news/claude-sonnet-5'
featured: true
type: 'blog'
---

### はじめに

2026年6月30日、Anthropicは新しいSonnetモデル「Claude Sonnet 5」を公開しました。前世代のSonnet 4.6（2026年2月17日リリース）から約4カ月半での更新です。最大の特徴は、SWE-bench Verifiedで**85.2**%というスコアを保ちながら、標準価格をSonnet 4.6と同じ「100万トークンあたり入力$3・出力$15」に据え置いた点（2026年8月31日までは導入価格の$2/$10が適用）。Free/ProプランのデフォルトモデルもこのタイミングでSonnet 5に切り替わりました。

本記事では、Anthropic公式のシステムカード（PDF）とPlatform Docsを一次ソースとして、ベンチマーク数値・API仕様・価格・提供範囲を確認します。

### 基本スペック

| 項目                   | 内容                                                                                                                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| APIモデルID            | `claude-sonnet-5`                                                                                                                                                                                                          |
| コンテキストウィンドウ | 1Mトークン（デフォルトかつ上限。縮小版はなし）                                                                                                                                                                             |
| 最大出力トークン       | 128k                                                                                                                                                                                                                       |
| Extended Thinking      | Adaptive Thinkingがデフォルトで有効（`thinking: {type: "disabled"}`で無効化は可能）。旧来の手動Extended Thinking（`thinking: {type: "enabled", budget_tokens: N}`）は廃止され400エラーに。制御は`effort`パラメータに一本化 |
| サンプリングパラメータ | `temperature` / `top_p` / `top_k` を既定値以外に設定すると400エラー                                                                                                                                                        |
| Priority Tier          | 非対応                                                                                                                                                                                                                     |
| トークナイザー         | 新方式を採用。同じ入力テキストでもSonnet 4.6比で約30%多いトークン数に変換される                                                                                                                                            |

トークナイザーの変更は地味に見えて実務上の影響が大きい点です。単価そのものはSonnet 4.6と変わらないものの、同じ文章がより多くのトークンに分割されるため、実際のリクエスト単価は上がり得ます。Platform Docsは「`max_tokens`をSonnet 4.6向けにチューニングしていた場合は出力が切り詰められる可能性があるため、再設定が必要」と明記しています。

### ベンチマークで見る性能向上

以下はAnthropic公式のシステムカード（Claude Sonnet 5 System Card、p.114 Table 8.1.A）本文を直接確認した数値です。Sonnet 5・Sonnet 4.6の列はAnthropic自身の評価結果ですが、GPT-5.5・Gemini 3.5 Flashの列はAnthropicが各社公式システムカードやリーダーボードから引用した値である点に注意してください（Anthropicによる二次引用であり、OpenAI・Google自身の発表値そのものとの照合はしていません）。

| ベンチマーク                       | Sonnet 5 | Sonnet 4.6 | GPT-5.5            | Gemini 3.5 Flash |
| ---------------------------------- | -------- | ---------- | ------------------ | ---------------- |
| SWE-bench Pro                      | 63.2%    | 58.1%      | 58.6%              | 55.1%            |
| Terminal-Bench 2.1                 | 80.4%    | 67.0%      | 83.4%（Codex CLI） | 76.2%            |
| BrowseComp（単一エージェント）     | 84.7%    | 76.2%      | 84.4%              | -                |
| Humanity's Last Exam（ツールなし） | 43.2%    | 34.6%      | 41.4%              | 40.2%            |
| OSWorld-Verified                   | 81.2%    | 78.5%      | 78.7%              | 78.4%            |
| FrontierCode v1                    | 38.8%    | 15.1%      | 25.5%              | -                |
| AutomationBench                    | 13.5%    | 5.3%       | 12.9%              | **14.5%**        |
| HealthBench Professional           | 57.8%    | 44.2%      | 51.8%              | -                |

なお上の表には含まれていませんが、システムカード本文8.2節では**SWE-bench Verified（500問の検証済みサブセット）でSonnet 5が85.2%**、SWE-bench Multilingualで78.3%、SWE-bench Multimodalで28.1%という個別スコアも報告されています（いずれもSonnet 5単独の数値で、この3項目については他モデルとの比較値は同節に記載がありません）。

いくつか興味深い点があります。まずAutomationBench（Zapier提供の業務自動化ベンチマーク）だけはGemini 3.5 FlashがSonnet 5を上回っており、Anthropicも表を隠さずそのまま掲載しています。もう一つはGDPval-AA v2（Artificial Analysisによる独立評価、220の実務タスクをEloレーティングで採点）で、SonnetシリーズはEloランキング上位を独占しつつも、Sonnet 5（1618）とOpus 4.8（1615）はほぼ同点、首位はFable 5（1783）でした。Sonnet級モデルがOpus級に肉薄しているという評価の裏付けになっています。

### エージェント関連の変更点

Sonnet 5は「Anthropicが公開した中で最もエージェント的なSonnetモデル」と位置づけられています。具体的には、計画立案からブラウザ・ターミナル操作、複数ステップにまたがるタスクの継続実行までを、以前は上位モデルでなければ難しかった水準でこなせるとされています。

セキュリティ面では、Sonnet 5はSonnet系として初めて**リアルタイムのサイバーセキュリティ・セーフガード**を搭載しました。禁止・高リスクなサイバーセキュリティ関連の依頼は拒否されますが、この拒否はHTTPエラーではなく`stop_reason: "refusal"`を伴う通常の200レスポンスとして返る仕様です（エラーハンドリングと混同しないよう注意が必要な点）。

### 提供範囲と価格

| プラン/チャネル                      | 扱い                                                           |
| ------------------------------------ | -------------------------------------------------------------- |
| Free / Pro                           | デフォルトモデル                                               |
| Max / Team / Enterprise              | 利用可能                                                       |
| Claude Code                          | 利用可能                                                       |
| Claude API                           | 全顧客に提供                                                   |
| AWS Bedrock / Claude Platform on AWS | 提供（レガシーのBedrock `InvokeModel`/`Converse` APIは非対応） |
| Google Cloud（Vertex AI）            | 提供                                                           |
| Microsoft Foundry                    | 提供                                                           |

価格は導入価格として2026年8月31日まで入力$2・出力$10（100万トークンあたり）、9月1日以降は標準価格の入力$3・出力$15に移行します。この標準価格自体はSonnet 4.6から変更されていません。

### 同時期に起きていたこと：Fable 5とMythos 5の輸出規制解除

Sonnet 5の公開と同じ週、Anthropicの最上位モデルFable 5・Mythos 5を巡る動きも決着しました。米商務省は6月12日付でこの2モデルに輸出規制を適用し、ユーザーの国籍をリアルタイムで検証できないことを理由にAnthropicは全ユーザー向けの提供を一時停止していました。Mythos 5は6月26日に政府承認を得た一部の米国内組織向けに先行復旧し、商務省は6月30日に規制解除、Fable 5は7月1日に全世界で復旧しています。19日間の運用停止を経ての決着でした。

これはSonnet 5そのものの機能とは別件ですが、同じ週にAnthropicの3モデル（Sonnet 5・Fable 5・Mythos 5）が動いたという点で、リリースの背景として押さえておく価値があります。

### まとめ

- Claude Sonnet 5は2026年6月30日公開、Free/Proプランの標準モデルに採用
- SWE-bench Verified 85.2%、SWE-bench Pro 63.2%など、Sonnet 4.6から明確な性能向上
- 標準価格（$3/$15、100万トークンあたり）はSonnet 4.6から据え置き。ただし新トークナイザーで同じ文章のトークン数が約30%増えるため実質コストは要再計算
- Sonnet系初のリアルタイム・サイバーセキュリティセーフガードを搭載
- Adaptive Thinkingがデフォルト化（`disabled`指定で無効化は可能）。旧来の手動Extended Thinking（`budget_tokens`指定）やサンプリングパラメータ変更はAPIエラーになる仕様変更あり
- 同じ週にFable 5・Mythos 5の輸出規制も解除され、Anthropicの主要モデルラインナップが一斉に動いた

**情報ソース：**

[[ogp:https://www.anthropic.com/news/claude-sonnet-5|https://cdn.sanity.io/images/4zrzovbb/website/458ea645ef6b729f6847cba16932716e6b547f2f-2880x1620.png|Introducing Claude Sonnet 5|Our most agentic Sonnet yet, with top-tier intelligence for coding and everyday professional work.|@AnthropicAI]]

[[ogp:https://techcrunch.com/2026/06/30/anthropic-launches-claude-sonnet-5-as-a-cheaper-way-to-run-agents/]]

[[ogp:https://www.cnbc.com/2026/06/30/anthropic-says-trump-admin-has-lifted-export-controls-on-claude-fable-5-and-mythos-5.html]]
