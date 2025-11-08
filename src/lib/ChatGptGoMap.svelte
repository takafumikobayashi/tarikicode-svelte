<script lang="ts">
	import { onMount } from 'svelte';
	import type L from 'leaflet';
	import { chatgptGoAsiaCountries, phaseColors } from './data/chatgpt-go-asia';

	let mapContainer: HTMLElement;
	let map: L.Map;

	onMount(() => {
		// Leafletをクライアントサイドでのみインポート（非同期）
		(async () => {
			const L = (await import('leaflet')).default;

			// LeafletのCSSを動的にロード
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
			document.head.appendChild(link);

			// マップの初期化（アジア地域を中心に）
			map = L.map(mapContainer).setView([15, 100], 4);

			// OpenStreetMapタイルレイヤーを追加
			L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				maxZoom: 19
			}).addTo(map);

			// 各国にマーカーを追加
			chatgptGoAsiaCountries.forEach((country) => {
				const color = phaseColors[country.phase];

				// カスタムアイコンを作成（色付き円形マーカー）
				const customIcon = L.divIcon({
					className: 'custom-marker',
					html: `<div style="
					background-color: ${color};
					width: 20px;
					height: 20px;
					border-radius: 50%;
					border: 2px solid white;
					box-shadow: 0 2px 4px rgba(0,0,0,0.3);
				"></div>`,
					iconSize: [20, 20],
					iconAnchor: [10, 10]
				});

				// マーカーを作成
				const marker = L.marker([country.lat, country.lng], {
					icon: customIcon
				}).addTo(map);

				// ポップアップを追加
				marker.bindPopup(`
				<div style="font-family: sans-serif;">
					<strong style="font-size: 1.1em;">${country.name}</strong><br>
					<span style="color: #666;">${country.nameEn}</span><br>
					<span style="color: ${color}; font-weight: bold; margin-top: 4px; display: inline-block;">
						${country.phaseLabel}
					</span>
				</div>
			`);

				// ホバー時にポップアップを表示
				marker.on('mouseover', () => {
					marker.openPopup();
				});
			});
		})();

		return () => {
			// クリーンアップ
			if (map) {
				map.remove();
			}
		};
	});
</script>

<div class="map-wrapper">
	<div bind:this={mapContainer} class="map-container" />
	<div class="legend">
		<h4>展開時期</h4>
		<div class="legend-item">
			<span class="legend-color" style="background-color: {phaseColors.august}"></span>
			<span>2025年8月開始（1カ国）</span>
		</div>
		<div class="legend-item">
			<span class="legend-color" style="background-color: {phaseColors.september}"></span>
			<span>2025年9月開始（1カ国）</span>
		</div>
		<div class="legend-item">
			<span class="legend-color" style="background-color: {phaseColors.october}"></span>
			<span>2025年10月拡大（16カ国）</span>
		</div>
	</div>
</div>

<style>
	.map-wrapper {
		position: relative;
		width: 90%;
		margin: 2em auto;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
	}

	.map-container {
		width: 100%;
		height: 500px;
		z-index: 1;
	}

	.legend {
		position: absolute;
		bottom: 20px;
		right: 20px;
		background: white;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		z-index: 5;
		font-size: 0.9rem;
	}

	.legend h4 {
		margin: 0 0 10px 0;
		font-size: 1rem;
		font-weight: 600;
		color: #333;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 6px;
	}

	.legend-item:last-child {
		margin-bottom: 0;
	}

	.legend-color {
		display: inline-block;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border: 2px solid white;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	/* モバイル対応 */
	@media (max-width: 768px) {
		.map-container {
			height: 400px;
		}

		.legend {
			bottom: 10px;
			right: 10px;
			padding: 10px;
			font-size: 0.8rem;
		}

		.legend h4 {
			font-size: 0.9rem;
		}
	}

	/* Leafletのポップアップスタイルをカスタマイズ */
	:global(.leaflet-popup-content-wrapper) {
		border-radius: 8px;
	}

	:global(.leaflet-popup-content) {
		margin: 12px;
	}
</style>
