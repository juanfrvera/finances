<script lang="ts">
	import { onMount } from 'svelte';
	import type { IDebt } from '@/lib/typings';
	import NumberFormat from '@/lib/components/number-format.svelte';
	import { DebtLogic } from '@/lib/util/logic/debt';

	export let data: IDebt;

	let view: {
		containerClass: string;
		payDirectionString: string;
	};

	onMount(() => {
		const isPaid = data.paidDate != null;
		const containerClass = isPaid ? 'paid' : 'unpaid';

		view = { containerClass, payDirectionString: DebtLogic.calculatePayStateString(data) };
	});
</script>

{#if view != null}
	<div class={view.containerClass}>
		<div>{view.payDirectionString}</div>
		<div class="data"><NumberFormat value={data.amount} /> {data.currency}</div>
	</div>
{/if}
