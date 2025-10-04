<script lang="ts">
	import LayoutGrid, { Cell } from '@smui/layout-grid';
</script>

<LayoutGrid>
	<Cell span={4}>
		<div class="demo-cell">
			<iframe
				class="speakerdeck-iframe"
				frameborder="0"
				src="https://speakerdeck.com/player/59662588fd324da6bceb344db49a6e50"
				title="2024.1.20気ままに勉強会#75"
				allowfullscreen="true"
				style="border: 0px; background: padding-box padding-box rgba(0, 0, 0, 0.1); margin: 0px; padding: 0px; border-radius: 6px; box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 40px; width: 100%; height: auto; aspect-ratio: 560 / 315;"
				data-ratio="1.7777777777777777"
			></iframe>
		</div>
	</Cell>
	<Cell span={4}>
		<div class="demo-cell">
			<iframe
				width="560"
				height="315"
				src="https://www.youtube.com/embed/snJDMC_8grA?si=t2RJ_PiorR3PNGWR"
				title="YouTube video player"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
				referrerpolicy="strict-origin-when-cross-origin"
				allowfullscreen
			></iframe>
		</div>
	</Cell>
	<Cell span={4}>
		<div class="demo-cell">
			<iframe
				class="note-embed"
				src="https://note.com/embed/notes/n16a999fe3b1e"
				title="Note article embed"
				style="border: 0; display: block; max-width: 99%; width: 494px; padding: 0px; margin: 10px 0px; position: static; visibility: visible;"
				height="400"
			></iframe><script
				async
				src="https://note.com/scripts/embed.js"
				charset="utf-8"
			></script>
		</div>
	</Cell>
</LayoutGrid>

<style>
	.demo-cell {
		width: 100%;
		margin-top: 1em;
		margin-bottom: 1em;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
