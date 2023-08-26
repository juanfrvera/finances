<script lang="ts">
	import { onMount } from 'svelte';
	import { ServiceItem } from '@/lib/util/logic/item';
	import type { IService } from '@/lib/typings';
	import NumberFormat from '@/lib/components/number-format.svelte';

	export let data: IService;
	const view: { containerClass?: string } = {};

	onMount(() => {
		if (data.isManual) {
			if (ServiceItem.wasThisMonthPaid(data)) {
				view.containerClass = 'paid';
			} else {
				view.containerClass = 'unpaid';
			}
		}
	});
</script>

<div class={view.containerClass}>
	<div class="name">{data.name}</div>
	<div class="data">
		<NumberFormat value={data.cost} />
		{data.currency}
	</div>
</div>
