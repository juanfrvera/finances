<script lang="ts">
	export let value: number;
	$: formattedString = (Math.round(value * 100) / 100).toFixed(2);
</script>

{formattedString}
