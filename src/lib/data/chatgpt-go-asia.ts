// ChatGPT Go アジア展開国のデータ
export interface CountryData {
	name: string;
	nameEn: string;
	lat: number;
	lng: number;
	phase: 'august' | 'september' | 'october';
	phaseLabel: string;
}

export const chatgptGoAsiaCountries: CountryData[] = [
	// 2025年8月開始
	{
		name: 'インド',
		nameEn: 'India',
		lat: 28.6139,
		lng: 77.209,
		phase: 'august',
		phaseLabel: '2025年8月開始'
	},

	// 2025年9月開始
	{
		name: 'インドネシア',
		nameEn: 'Indonesia',
		lat: -6.2088,
		lng: 106.8456,
		phase: 'september',
		phaseLabel: '2025年9月開始'
	},

	// 2025年10月拡大（16カ国）
	{
		name: 'アフガニスタン',
		nameEn: 'Afghanistan',
		lat: 34.5553,
		lng: 69.2075,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'バングラデシュ',
		nameEn: 'Bangladesh',
		lat: 23.8103,
		lng: 90.4125,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'ブータン',
		nameEn: 'Bhutan',
		lat: 27.4728,
		lng: 89.639,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'ブルネイ',
		nameEn: 'Brunei',
		lat: 4.9031,
		lng: 114.9398,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'カンボジア',
		nameEn: 'Cambodia',
		lat: 11.5564,
		lng: 104.9282,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'ラオス',
		nameEn: 'Laos',
		lat: 17.9757,
		lng: 102.6331,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'マレーシア',
		nameEn: 'Malaysia',
		lat: 3.139,
		lng: 101.6869,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'モルディブ',
		nameEn: 'Maldives',
		lat: 4.1755,
		lng: 73.5093,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'ミャンマー',
		nameEn: 'Myanmar',
		lat: 16.8661,
		lng: 96.1951,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'ネパール',
		nameEn: 'Nepal',
		lat: 27.7172,
		lng: 85.324,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'パキスタン',
		nameEn: 'Pakistan',
		lat: 33.6844,
		lng: 73.0479,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'フィリピン',
		nameEn: 'Philippines',
		lat: 14.5995,
		lng: 120.9842,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'スリランカ',
		nameEn: 'Sri Lanka',
		lat: 6.9271,
		lng: 79.8612,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'タイ',
		nameEn: 'Thailand',
		lat: 13.7563,
		lng: 100.5018,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: '東ティモール',
		nameEn: 'Timor-Leste',
		lat: -8.5569,
		lng: 125.5603,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	},
	{
		name: 'ベトナム',
		nameEn: 'Vietnam',
		lat: 21.0285,
		lng: 105.8542,
		phase: 'october',
		phaseLabel: '2025年10月拡大'
	}
];

// 時期ごとの色設定
export const phaseColors = {
	august: '#4CAF50', // 緑
	september: '#2196F3', // 青
	october: '#FFC107' // 黄色
} as const;
