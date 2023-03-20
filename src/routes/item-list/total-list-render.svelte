<script lang="ts">
	import type { IItemData, ITotalItemConfig } from '../../typings';

	export let data: IItemData<ITotalItemConfig>;
</script>

<div>Total</div>
{#each data.config.currencies as currencyTotal}
	<div>{currencyTotal.total} {currencyTotal.name}</div>
{/each}
