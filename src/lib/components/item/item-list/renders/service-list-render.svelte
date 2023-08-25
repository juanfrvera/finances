<script lang="ts">
	import { onMount } from 'svelte';
	import { ServiceItem } from '@/lib/util/logic/item';
	import type { IServiceConfig, IItemData } from '../../../../typings';
	import NumberFormat from '@/lib/components/number-format.svelte';

	export let data: IItemData<IServiceConfig>;
	const view: { containerClass?: string } = {};

	onMount(() => {
		if (data.config.isManual) {
			if (ServiceItem.wasThisMonthPaid(data)) {
				view.containerClass = 'paid';
			} else {
				view.containerClass = 'unpaid';
			}
		}
	});
</script>

<div class={view.containerClass}>
	<div class="name">{data.config.name}</div>
	<div class="data">
		<NumberFormat value={data.config.cost} />
		{data.config.currency}
	</div>
</div>
