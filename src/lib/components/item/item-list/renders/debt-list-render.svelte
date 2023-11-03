<script lang="ts">
	import { onMount } from 'svelte';
	import type { IDebt } from '@/lib/typings';
	import NumberFormat from '@/lib/components/number-format.svelte';
	import { DebtLogic } from '@/lib/util/logic/debt';

	export let data: IDebt;

	let ui: {
		containerClass: string;
		payDirectionString: string;
		amountToShow: number;
	};

	onMount(() => {
		const paidAmonut = DebtLogic.getPaidAmount(data);
		const isPaid = paidAmonut >= data.amount;
		const containerClass = isPaid ? 'paid' : 'unpaid';

		ui = {
			containerClass,
			payDirectionString: DebtLogic.calculatePayStateString(data),
			amountToShow: isPaid ? paidAmonut : data.amount - paidAmonut
		};
	});
</script>

{#if ui != null}
	<div class={ui.containerClass}>
		<div>{ui.payDirectionString}</div>
		{#if data.description}
			<div>{data.description}</div>
		{/if}
		<div class="data"><NumberFormat value={ui.amountToShow} /> {data.currency}</div>
	</div>
{/if}
