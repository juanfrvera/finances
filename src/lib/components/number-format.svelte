<script lang="ts">
	export let value: number;
	$: intPart = Math.floor(value)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	$: decimalPart = ((value - Math.floor(value)) * 100).toFixed(0);
</script>

<span class="int-part">{intPart}</span>{#if decimalPart != '0'}<span class="decimal-part"
		>.{decimalPart}</span
	>{/if}

<style>
	.decimal-part {
		font-size: 16px;
	}
</style>
