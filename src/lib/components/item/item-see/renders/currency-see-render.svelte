<script lang="ts">
	import NumberFormat from '@/lib/components/number-format.svelte';
	import type { ICurrencyUI } from '@/lib/typings';
	import { Pie } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		CategoryScale,
		type ChartData
	} from 'chart.js';
	import { PASTEL_COLORS } from '@/lib/util/color';
	import { onDestroy, onMount } from 'svelte';
	import type { Subscription } from 'rxjs';
	import { ItemChannel } from '@/lib/services/channel.service';
	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

	let subscription: Subscription;
	export let data: ICurrencyUI;

	let pieData: ChartData<'pie', number[]> = calculatePieData();

	onMount(() => {
		subscription = ItemChannel.$channel.subscribe((signal) => {
			if (signal.type === 'itemEdited' && signal.data.item.currency === data.currency) {
				pieData = calculatePieData();
			}
		});
	});

	onDestroy(() => {
		subscription.unsubscribe();
	});

	function calculatePieData() {
		return {
			labels: data.accounts?.map((a) => a.name) ?? [],
			datasets: [
				{
					data: data.accounts?.map((a) => a.balance) ?? [],
					backgroundColor: PASTEL_COLORS
				}
			]
		};
	}
</script>

{#if data != null}
	<div class="currency-see">
		<div>This is the total of your accounts in <strong>{data.currency}</strong></div>
		<div class="currency-total">
			<NumberFormat value={data.total} />
			{data.currency}
		</div>
		<div>You can delete this item if you want to delete the currency</div>
		<Pie data={pieData} />
	</div>
{/if}

<style>
	.currency-see {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 8px;
	}

	.currency-total {
		font-size: 24px;
	}
</style>
