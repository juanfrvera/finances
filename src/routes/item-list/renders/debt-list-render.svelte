<script lang="ts">
	import { onMount } from 'svelte';
	import type { IDebtConfig, IItemData } from '@/typings';
	import NumberFormat from '@/components/number-format.svelte';
	import { DebtLogic } from '@/logic/debt';

	export let data: IItemData<IDebtConfig>;

	let view: {
		containerClass: string;
		payDirectionString: string;
	};

	onMount(() => {
		const isPaid = data.config.paidDate != null;
		const containerClass = isPaid ? 'paid' : 'unpaid';

		view = { containerClass, payDirectionString: DebtLogic.calculatePayStateString(data) };
	});
</script>

{#if view != null}
	<div class={view.containerClass}>
		<div>{view.payDirectionString}</div>
		<div class="data"><NumberFormat value={data.config.amount} /> {data.config.currency}</div>
	</div>
{/if}
