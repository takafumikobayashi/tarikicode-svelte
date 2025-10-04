<script>
	import { AppConfig } from './AppConfig';
</script>

<div class="footer">
	<p>{AppConfig.copyright}</p>
</div>

<style>
	.footer {
		padding: 20px;
		text-align: center;
		position: static;
		bottom: 0;
		left: 0; /* ビューポートの左端から */
		right: 0; /* ビューポートの右端まで */
		width: 100%;
		box-sizing: border-box; /* パディングを含めて幅を計算 */
	}

	@media (max-width: 600px) {
		.footer {
			padding: 10px;
		}
	}
</style>
