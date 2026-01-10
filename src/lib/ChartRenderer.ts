import {
	Chart,
	BarController,
	BarElement,
	PieController,
	ArcElement,
	LineController,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Title,
	Tooltip,
	Legend,
	type ChartConfiguration
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

// 必要なChart.jsコンポーネントを登録
Chart.register(
	BarController,
	BarElement,
	PieController,
	ArcElement,
	LineController,
	LineElement,
	PointElement,
	CategoryScale,
	LinearScale,
	Title,
	Tooltip,
	Legend,
	ChartDataLabels
);

interface ChartData {
	type: 'bar' | 'line' | 'pie';
	labels: string[];
	data: number[];
	label?: string;
	backgroundColor?: string[];
	borderColor?: string[];
}

// Chart.js用のグラフをレンダリングする関数
export function renderCharts(isDarkMode: boolean = false) {
	const chartElements = document.querySelectorAll('code.language-chartjs');

	if (chartElements.length === 0) {
		return;
	}

	chartElements.forEach((element, index) => {
		const chartCode = element.textContent || '';

		try {
			// JSON形式でチャートデータをパース
			const chartData: ChartData = JSON.parse(chartCode);

			// Canvas要素を作成
			const canvas = document.createElement('canvas');
			canvas.id = `chart-${index}`;
			canvas.style.maxHeight = chartData.type === 'pie' ? '500px' : '400px';

			// Brand Harmony: ブランドカラー重視の配色
			const defaultBackgroundColors = isDarkMode
				? ['#9FA8DA', '#64B5F6', '#B0BEC5', '#80CBC4', '#B39DDB'] // ダークモード: 柔らかい青紫系
				: ['#4b53bc', '#42A5F5', '#676778', '#26A69A', '#7E57C2']; // ライトモード: 信頼感のある落ち着いた配色

			const defaultBorderColors = isDarkMode
				? ['#7986CB', '#42A5F5', '#90A4AE', '#4DB6AC', '#9575CD'] // ダークモード: やや濃いめ
				: ['#3949ab', '#1E88E5', '#4A4A5A', '#00897B', '#5E35B1']; // ライトモード: 濃いめ

			// Chart.jsの設定
			const textColor = isDarkMode ? '#E9ECEF' : '#495057';
			const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

			const config: ChartConfiguration = {
				type: chartData.type,
				data: {
					labels: chartData.labels,
					datasets: [
						{
							label: chartData.label || 'データ',
							data: chartData.data,
							backgroundColor: chartData.backgroundColor || defaultBackgroundColors,
							borderColor: chartData.borderColor || defaultBorderColors,
							borderWidth: 1
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: true,
					layout: {
						padding:
							chartData.type === 'pie'
								? { top: 60, bottom: 60, left: 50, right: 50 } // 円グラフは外側ラベルのため上下に大きめの余白
								: 10
					},
					plugins: {
						legend: {
							display: chartData.type !== 'pie', // 円グラフは凡例を非表示
							position: 'top',
							labels: {
								color: textColor,
								padding: 10
							}
						},
						datalabels:
							chartData.type === 'pie'
								? {
										color: isDarkMode ? '#E9ECEF' : '#495057', // テーマに応じた色
										font: {
											weight: 'bold',
											size: 14
										},
										anchor: 'end', // データポイントの端にアンカー
										align: 'end', // 外側に配置
										offset: 10, // 円から10px離す
										formatter: (
											value: number,
											context: { chart: Chart; dataIndex: number }
										) => {
											const dataArray = context.chart.data.datasets[0]
												.data as number[];
											const total = dataArray.reduce((a, b) => a + b, 0);
											const percentage = ((value / total) * 100).toFixed(1);
											const label =
												context.chart.data.labels?.[context.dataIndex] ||
												'';
											return `${label}\n${percentage}%`;
										}
									}
								: {
										display: false
									},
						title: {
							display: false,
							color: textColor
						},
						tooltip: {
							enabled: true,
							callbacks:
								chartData.type === 'pie'
									? {
											label: function (context) {
												const label = context.label || '';
												const value = context.parsed || 0;
												const dataArray = context.dataset.data as number[];
												const total = dataArray.reduce((a, b) => a + b, 0);
												const percentage = ((value / total) * 100).toFixed(
													1
												);
												return `${label}: ${value}億ドル (${percentage}%)`;
											}
										}
									: undefined
						}
					},
					scales:
						chartData.type === 'bar'
							? {
									x: {
										ticks: {
											color: textColor
										},
										grid: {
											color: gridColor
										}
									},
									y: {
										beginAtZero: true,
										ticks: {
											color: textColor
										},
										grid: {
											color: gridColor
										}
									}
								}
							: undefined
				}
			};

			// 元のcode要素をcanvasに置き換え
			const container = document.createElement('div');
			container.classList.add('chart-container');
			container.style.position = 'relative';
			container.style.height = chartData.type === 'pie' ? '500px' : '400px';
			container.appendChild(canvas);
			element.replaceWith(container);

			// Chart.jsでグラフを描画し、インスタンスとデータを保存
			const chartInstance = new Chart(canvas, config);
			chartInstances.push({ chart: chartInstance, data: chartData });
		} catch (error) {
			console.error('Chart.js rendering error:', error);
			// エラー時は元のコードブロックをそのまま表示
		}
	});
}

// Chart.jsインスタンスとデータを保持する配列
const chartInstances: Array<{ chart: Chart; data: ChartData }> = [];

// チャートインスタンスをクリーンアップする関数
export function cleanupCharts() {
	chartInstances.forEach(({ chart }) => {
		chart.destroy();
	});
	chartInstances.length = 0;
}

// テーマ変更時にチャートの色を更新する関数
export function updateChartsTheme(isDarkMode: boolean) {
	// Brand Harmony: ブランドカラー重視の配色
	const defaultBackgroundColors = isDarkMode
		? ['#9FA8DA', '#64B5F6', '#B0BEC5', '#80CBC4', '#B39DDB'] // ダークモード: 柔らかい青紫系
		: ['#4b53bc', '#42A5F5', '#676778', '#26A69A', '#7E57C2']; // ライトモード: 信頼感のある落ち着いた配色

	const defaultBorderColors = isDarkMode
		? ['#7986CB', '#42A5F5', '#90A4AE', '#4DB6AC', '#9575CD'] // ダークモード: やや濃いめ
		: ['#3949ab', '#1E88E5', '#4A4A5A', '#00897B', '#5E35B1']; // ライトモード: 濃いめ

	const textColor = isDarkMode ? '#E9ECEF' : '#495057';
	const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

	// すべてのチャートの色設定を更新
	chartInstances.forEach(({ chart, data }) => {
		// データセットの色を更新
		if (chart.data.datasets[0]) {
			chart.data.datasets[0].backgroundColor =
				data.backgroundColor || defaultBackgroundColors;
			chart.data.datasets[0].borderColor = data.borderColor || defaultBorderColors;
		}

		// オプションの色を更新
		if (chart.options.plugins?.legend?.labels) {
			chart.options.plugins.legend.labels.color = textColor;
		}
		if (chart.options.plugins?.title) {
			chart.options.plugins.title.color = textColor;
		}
		// データラベルの色を更新（円グラフ用）
		if (chart.options.plugins?.datalabels && data.type === 'pie') {
			chart.options.plugins.datalabels.color = isDarkMode ? '#E9ECEF' : '#495057';
		}

		// スケールの色を更新（棒グラフの場合）
		if (chart.options.scales) {
			if (chart.options.scales.x) {
				if (chart.options.scales.x.ticks) {
					chart.options.scales.x.ticks.color = textColor;
				}
				if (chart.options.scales.x.grid) {
					chart.options.scales.x.grid.color = gridColor;
				}
			}
			if (chart.options.scales.y) {
				if (chart.options.scales.y.ticks) {
					chart.options.scales.y.ticks.color = textColor;
				}
				if (chart.options.scales.y.grid) {
					chart.options.scales.y.grid.color = gridColor;
				}
			}
		}

		// チャートを更新
		chart.update();
	});
}
