# AI News Article Generator

**過去7日間の最新AI/LLMニュース**について、最もインパクトが大きいトピックを選び、**ai-news-fetcherスキル**を使って高品質な日本語ブログ記事を作成してください。

## 日付条件

- 検索対象期間：**今日の日付から遡って過去7日間**
- 記事の日付（frontmatter）：**今日の日付**を使用

## 実行手順

ai-news-fetcherスキルのワークフローに従い、以下を実施してください：

### 1. Research Phase（情報収集）

- 過去7日間のAI/LLMニュースを**複数のWebSearch**（最低3回）で調査
- OpenAI、Anthropic、Google、DeepSeek、Metaなどの主要企業の発表をチェック
- 新モデルリリース、機能アップデート、価格改定、業界動向などを確認
- 最もインパクトが大きいトピックを1つ選定

### 2. Deep Dive（詳細調査）

- 選定したトピックについて、さらに**2-3回のWebSearch**で詳細情報を収集
- ベンチマークスコア、価格、技術仕様などの具体的な数値データを取得
- 複数の情報源から信頼性を確認

### 3. Article Structure Planning

- ニュースタイプに応じた記事構成を決定：
    - Major Model Release（新モデル発表）
    - Feature Update（機能アップデート）
    - Industry Trend（業界トレンド）

### 4. Writing（記事作成）

- tarikicode-svelteブログフォーマットに準拠したfrontmatterを作成
- タイトル：具体的な数値を含め、インパクトを明確に（例：「95%コスト削減」「GPT-5を超える性能」）
- 本文：h3/h4見出しの階層構造、比較表、具体的なデータを豊富に含める
- まとめセクション：箇条書きで主要ポイントを整理

### 5. Image URL設定

- frontmatterの`image`フィールドに、信頼できる外部URLを設定
- OGP画像が自動取得されることを確認

### 6. Quality Check

- [ ] Frontmatter完備（title, date, category, tags, description, image, featured, type）
- [ ] 日付は今日の日付（YYYY-MM-DD形式）
- [ ] Description: 100-160文字
- [ ] Tags: 3-5個
- [ ] 階層的見出し構造
- [ ] 具体的な数値データ含む
- [ ] 比較表を含む
- [ ] まとめセクション完備
- [ ] ファイル名: `YYYY-MM-DD-slug.md`

### 7. Save

- ファイルパス：`src/posts/YYYY-MM-DD-slug.md`

## 完了後

記事作成完了後、以下を提示してください：

1. ✅ 記事のタイトルとファイル名
2. ✅ 主要なハイライト（箇条書き3-5項目）
3. ✅ Quality Check結果

---

**Note**: このコマンドは、ai-news-fetcherスキルを**必ず使用**してください。スキルなしでの記事作成は品質基準を満たさない可能性があります。
