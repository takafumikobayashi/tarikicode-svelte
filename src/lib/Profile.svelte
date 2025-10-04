<script lang="ts">
	import DataTable, { Head, Body, Row, Cell } from '@smui/data-table';
</script>

<div class="mdc-typography--headline5">
	<p>Carrer</p>
	<p></p>
</div>

<div class="mdc-typography--body1">
	<DataTable table$aria-label="People list" style="max-width: 100%;">
		<Head>
			<Row>
				<Cell>Year</Cell>
				<Cell>Company</Cell>
				<Cell>Detail</Cell>
			</Row>
		</Head>
		<Body>
			<Row>
				<Cell>2023</Cell>
				<Cell>経済産業省 デジタルトランスフォーメーション室</Cell>
				<Cell
					>PowerPlatformを使った行政手続オンライン化システムのプロダクトマネジメント<br
					/>デジタルツールを活用したワークエンゲージメントと組織コミュニケーション活性化施策</Cell
				>
			</Row>
			<Row>
				<Cell>2021</Cell>
				<Cell>bitbank株式会社</Cell>
				<Cell
					>暗号資産トレードアプリのUX継続的改善、トラベルルールなど規制対応に関する機能追加<br
					/>新規事業におけるライセンス取得に向けたプロジェクトマネジメント</Cell
				>
			</Row>
			<Row>
				<Cell>2012</Cell>
				<Cell>ソフトバンク株式会社（転籍）</Cell>
				<Cell
					>基地局建設工事に関する統合管理システムのプロジェクトマネージャー<br
					/>内製エンジニア組織のエンジアリングマネージャー</Cell
				>
			</Row>
			<Row>
				<Cell>2005</Cell>
				<Cell>イー・モバイル株式会社（出向）</Cell>
				<Cell>携帯電話事業の立ち上げ<br />工事管理に関するシステム開発・運用</Cell>
			</Row>
			<Row>
				<Cell>2002</Cell>
				<Cell>イー・アクセス株式会社</Cell>
				<Cell
					>バックボーネットワーク構築エンジニア<br
					/>工事管理・顧客管理システムの開発・運用・大規模システム移行対応</Cell
				>
			</Row>
			<Row>
				<Cell>1998</Cell>
				<Cell>某SI企業</Cell>
				<Cell
					>製造業・流通業などに常駐するWebアプリプログラマー<br
					/>COBOLプログラムの2000年問題対応</Cell
				>
			</Row>
		</Body>
	</DataTable>
</div>

<style>
	/* Reset some of the demo app styles that interfere. */
	:global(body),
	:global(html) {
		height: auto;
		width: auto;
		position: static;
	}
	:global(#smui-app) {
		display: block;
		height: auto;
		overflow: none;
	}
</style>
