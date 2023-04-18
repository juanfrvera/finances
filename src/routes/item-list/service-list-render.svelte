<script lang="ts">
	import { onMount } from 'svelte';
	import { ServiceItem } from '../../logic/item';
	import type { IServiceConfig, IItemData } from '../../typings';

	export let data: IItemData<IServiceConfig>;
	const view: { containerClass?: string } = {};

	onMount(() => {
		if (data.config.isManual) {
			if (ServiceItem.wasThisMonthPaid(data)) {
				view.containerClass = 'manual-paid';
			} else {
				view.containerClass = 'should-manual-pay';
			}
		}
	});
</script>

<div class={view.containerClass}>
	<div class="name">{data.config.name}</div>
	<div class="data">{data.config.cost} {data.config.currency}</div>
</div>

<style>
	.should-manual-pay {
		border: 1px solid red;
	}
	.manual-paid {
		border: 1px solid green;
	}
</style>
