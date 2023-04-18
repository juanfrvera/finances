<script lang="ts">
	import { onMount } from 'svelte';
	import type { IDebtConfig, IItemData } from '../../typings';
	import NumberFormat from '../util/number-format.svelte';

	export let data: IItemData<IDebtConfig>;

	let view: { paySideString: string };

	onMount(() => {
		let paySideString = 'You pay';
		if (data.config.theyPayMe) {
			paySideString = 'They pay';
		}
		view = { paySideString };
	});
</script>

{#if view != null}
	<div class="name">{data.config.withWho}</div>
	<div class="data"><NumberFormat value={data.config.amount} /> {data.config.currency}</div>
	<div>{view.paySideString}</div>
{/if}
