<script lang="ts">
	import NumberFormat from '@/lib/components/number-format.svelte';
	import type { ICurrency } from '@/lib/typings';

	export let data: ICurrency;
</script>

{#if data != null}
	<div class="currency-see">
		<div>This is the total of your accounts in <strong>{data.currency}</strong></div>
		<div class="currency-total">
			<NumberFormat value={data.total} />
			{data.currency}
		</div>
		<div>You can delete this item if you want to delete the currency</div>
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
