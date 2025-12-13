---
title: 'OpenAI「code red」からの反撃：GPT-5.2がARC-AGI-2で54%、AIME 2025で100%を達成'
date: '2025-12-13'
category: 'AI'
tags: ['OpenAI', 'GPT-5.2', 'ChatGPT', 'ベンチマーク', 'Gemini']
description: '2025年12月11日、OpenAIが緊急リリースしたGPT-5.2は、ARC-AGI-2で54.2%、AIME 2025で100%を記録。Google Gemini 3への「code red」対応として3週間前倒しで投入された新モデルの全貌を解説。'
image: 'https://techcrunch.com/2025/12/11/openai-fires-back-at-google-with-gpt-5-2-after-code-red-memo/'
featured: true
type: 'blog'
---

### 「code red」宣言から2週間、OpenAIが放つ起死回生の一手

2025年12月11日（米国東部時間）、OpenAIは予定より**3週間前倒し**でGPT-5.2をリリースしました。これは、Google Gemini 3の発表後にCEOサム・アルトマンが社内で発令した「**code red**」——緊急事態宣言——への回答です。

11月中旬にGemini 3がベンチマークリーダーボードを席巻し、ChatGPTのトラフィックが減少する中、OpenAIは非必須プロジェクトを一時停止し、エンジニアリングリソースをコアモデル改善に集中させました。その結果生まれたGPT-5.2は、**ARC-AGI-2で54.2%**（Gemini 3 Deep Think: 45.1%、Claude Opus 4.5: 37.6%）、**AIME 2025で100%**（ツール不使用）という驚異的なスコアを記録しています。

### GPT-5.2の3つのバリエーション

GPT-5.2は用途に応じた3つのモードで提供されています：

#### GPT-5.2 Instant

- **用途**: 日常的なタスク、素早い情報取得
- **コンテキストウィンドウ**: 128,000トークン
- **最大出力**: 16,384トークン
- **API料金**: $1.75/100万入力トークン、$14/100万出力トークン

#### GPT-5.2 Thinking

- **用途**: 複雑なコーディング、スプレッドシート作成、構造化タスク
- **コンテキストウィンドウ**: 400,000トークン
- **最大出力**: 128,000トークン
- **API料金**: $1.75/100万入力トークン、$14/100万出力トークン（キャッシュ入力90%割引）

#### GPT-5.2 Pro

- **用途**: 最高精度が求められる難問
- **コンテキストウィンドウ**: 400,000トークン
- **最大出力**: 128,000トークン
- **API料金**: $21/100万入力トークン、$168/100万出力トークン

### ベンチマーク性能：3強比較

2025年12月時点での主要ベンチマークを比較します。**各社の公式発表値**を基に、条件が異なる場合は注記しています。

| ベンチマーク                           | GPT-5.2 Pro | Gemini 3 Deep Think | Claude Opus 4.5 |
| -------------------------------------- | ----------- | ------------------- | --------------- |
| **ARC-AGI-2 Verified**（抽象推論）     | **54.2%**※1 | 45.1%※2             | 37.6%           |
| **AIME 2025**（数学）                  | **100%**※1  | -                   | 未公表          |
| **GPQA Diamond**（科学）               | **93.2%**   | 93.8%               | 89.4%           |
| **SWE-bench Verified**（コーディング） | 80.0%       | -                   | **80.9%**       |
| **Humanity's Last Exam**               | 36.6%※1     | **41.0%**           | 35.8%           |
| **FrontierMath**（上級数学）           | **40.3%**   | 36.7%               | 未公表          |

> **注記**
>
> - ※1: OpenAI公式発表値（no tools条件）
> - ※2: Google公式発表値（with code execution条件）
> - -(ハイフン） : 公式一次ソースで同条件の数値が確認できないため省略

#### 注目ポイント

- **ARC-AGI-1（Verified）**: GPT-5.2 Proが初めて**90%超え**（90.3%）を達成
- **ARC-AGI-2（Verified）**: GPT-5.2はThinking 52.9%、Pro 54.2%でSOTA。ただしGoogleはコード実行ありの条件で45.1%を発表しており、**条件が異なるため単純比較は困難**
- **SWE-bench**: Claude Opus 4.5が80.9%でトップを維持（Anthropic公式）。GPT-5.2は80.0%で僅差
- **数学**: AIME 2025でGPT-5.2 Proがno toolsで100%を達成

### 技術仕様と新機能

GPT-5.2の主な技術的特徴：

- **コンテキストウィンドウ**: 400,000トークン（GPT-5.1と同等）
- **最大出力トークン**: 128,000トークン
- **知識カットオフ**: 2025年8月31日
- **幻覚率**: GPT-5.1比で**38%削減**
- **処理速度**: GPT-5.1比で**50%高速化**

#### エンタープライズ向け強化

GPT-5.2は特にビジネス用途での性能向上に注力しています：

- **GDPval**（プロフェッショナルタスク）: 人間の専門家を**70.9**%の確率で上回る（GPT-5: 38.8%、Claude Opus 4.5: 59.6%）
- **スプレッドシート作成**: 複雑な数式や関数を含む高度なExcel/Sheets操作
- **プレゼンテーション生成**: 構造化されたスライドの自動作成
- **長文脈理解**: 400Kトークンで数百のドキュメントを一括処理

### API料金比較

各モデルのAPI料金（100万トークンあたり）：

| モデル           | 入力料金 | 出力料金 | コンテキスト |
| ---------------- | -------- | -------- | ------------ |
| GPT-5.2 Thinking | $1.75    | $14.00   | 400K         |
| GPT-5.2 Pro      | $21.00   | $168.00  | 400K         |
| Claude Opus 4.5  | $15.00   | $75.00   | 200K         |
| Gemini 3 Pro     | $1.25    | $5.00    | 2M           |

- **コスパ重視**: Gemini 3 Proが圧倒的に安価（ただし最高精度ではない）
- **バランス型**: GPT-5.2 Thinkingがコストと性能のバランスで優秀
- **最高精度**: Claude Opus 4.5とGPT-5.2 Proが僅差で競り合い

### 各モデルの得意分野

3強それぞれに明確な強みがあります：

#### GPT-5.2が得意な領域

- **フロントエンド開発**: 複雑なUI/UXの実装で高評価
- **エンタープライズツール**: スプレッドシート、プレゼンテーション生成
- **抽象的推論**: ARC-AGI-2での圧倒的なスコア
- **数学・科学**: AIME、FrontierMathでの最高スコア

#### Claude Opus 4.5が得意な領域

- **コーディング精度**: SWE-bench Verifiedで依然トップ
- **自律的操作**: Computer Use機能でのタスク完遂
- **ターミナル操作**: Terminal-bench 2.0で59.3%

#### Gemini 3 Proが得意な領域

- **コストパフォーマンス**: 最も安価なAPI料金
- **コンテキスト長**: 2Mトークンで長大なドキュメント処理
- **マルチモーダル**: 動画理解（Video-MMMU: 87.6%）で圧倒

### 「code red」の背景と今後

#### なぜOpenAIは緊急対応したのか

11月のGemini 3発表後、OpenAIは以下の危機に直面していました：

1. **ベンチマーク首位陥落**: 主要リーダーボードでGemini 3に追い抜かれた
2. **ChatGPTトラフィック減少**: ユーザーがGeminiに流出
3. **エンタープライズ市場シェア低下**: Anthropicが40%、OpenAIが27%に逆転

#### サム・アルトマンの発言

アルトマンCEOはCNBCのインタビューで「Gemini 3の影響は当初恐れていたほど大きくなかった」と述べ、**2026年1月までにcode redを解除できる見込み**と語りました。

#### ディズニーとの大型提携

GPT-5.2発表と同時に、ディズニーはOpenAIに**10億ドルのエクイティ投資**を行い、同時にスター・ウォーズ、ピクサー、マーベルなどのキャラクターをSora（動画生成AI）で扱えるライセンス契約も締結しました。これはOpenAIのコンテンツエコシステム拡大の大きな一歩です。

### 開発者向け：すぐに試す方法

GPT-5.2は以下の方法で利用可能です：

#### ChatGPTユーザー

- **Plus/Pro/Team/Enterprise**: 即座に利用可能
- モデル選択で「GPT-5.2」を選択

#### API開発者

```python
from openai import OpenAI

client = OpenAI()

# GPT-5.2 Thinking
response = client.chat.completions.create(
    model="gpt-5.2",
    messages=[{"role": "user", "content": "複雑なタスク"}]
)

# GPT-5.2 Instant
response = client.chat.completions.create(
    model="gpt-5.2-chat-latest",
    messages=[{"role": "user", "content": "素早い質問"}]
)

# GPT-5.2 Pro（Responses API）
response = client.responses.create(
    model="gpt-5.2-pro",
    input="最高精度が必要なタスク"
)
```

### まとめ

GPT-5.2の登場により、2025年末のAI三強競争はさらに激化しています：

- **OpenAI GPT-5.2**: ARC-AGI-2で54.2%、AIME 2025で100%を達成。抽象推論と数学で業界をリード
- **code red対応**: 3週間前倒しリリースでGemini 3に反撃。1月までに緊急体制解除の見込み
- **3つのバリエーション**: Instant（高速）、Thinking（構造化タスク）、Pro（最高精度）で用途別に最適化
- **エンタープライズ強化**: GDPvalで70.9%、プロフェッショナルタスクで人間専門家を上回る
- **ディズニー提携**: 10億ドル投資とキャラクターライセンスでSoraエコシステム拡大

AI業界の覇権争いは、2025年も最後まで目が離せない展開が続いています。

### 参考リンク

[[ogp:https://openai.com/index/introducing-gpt-5-2/]]
[[ogp:https://openai.com/index/disney-sora-agreement/]]
[[ogp:https://techcrunch.com/2025/12/11/openai-fires-back-at-google-with-gpt-5-2-after-code-red-memo/]]
[[ogp:https://fortune.com/2025/12/11/openai-gpt-5-2-launch-aims-to-silence-concerns-it-is-falling-behind-google-anthropic-code-red/]]
[[ogp:https://openai.com/research/gpt-5-2-system-card]]
[[ogp:https://www.cnbc.com/2025/12/11/openai-intros-new-ai-model-gpt-5point2-says-better-at-professional-tasks.html]]
