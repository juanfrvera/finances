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
		type ChartData,
		Colors
	} from 'chart.js';
	import { onMount } from 'svelte';
	import { ItemService } from '@/lib/services/item.service';
	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, Colors);

	export let data: ICurrencyUI;

	const pieData: ChartData<'pie', number[]> = {
		labels: data.accounts?.map((a) => a.name) ?? [],
		datasets: [
			{
				data: data.accounts?.map((a) => a.balance) ?? []
			}
		]
	};

	onMount(() => {
		ItemService;
	});
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
