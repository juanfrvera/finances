<script lang="ts">
	import type { IItemData, ITotalItemConfig } from '../../typings';
	import NumberFormat from '../util/number-format.svelte';

	export let data: IItemData<ITotalItemConfig>;
</script>

<div>Total</div>
{#each data.config.currencies as currencyTotal}
	<div><NumberFormat value={currencyTotal.total} /> {currencyTotal.name}</div>
{/each}
