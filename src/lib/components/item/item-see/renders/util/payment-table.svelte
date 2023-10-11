<script lang="ts">
	import NumberFormat from '@/lib/components/number-format.svelte';
	import type { IPaymentUI } from '@/lib/util/typings/payment.typings';

	export let onRowClicked: (payment: IPaymentUI) => any;
	export let payments: IPaymentUI[] | undefined;
	export let showUsdColumn: boolean | undefined;

	function rowClicked(payment: IPaymentUI) {
		onRowClicked(payment);
	}
</script>

{#if payments}
	<div class="pay-table">
		<div class="pay-table__title">Payments</div>
		<div
			class="pay-table__table {showUsdColumn
				? 'pay-table__table_4-columns'
				: 'pay-table__table_3-columns'}"
			role="table"
		>
			<div class="pay-table__header pay-table__row" role="rowgroup">
				<div class="pay-table__column">Amount</div>
				<div class="pay-table__column">Date</div>
				{#if showUsdColumn}<div class="pay-table__column">USD</div>{/if}
				<div class="pay-table__column">Notes</div>
			</div>

			{#each payments as payment (payment.amount + '//' + payment.dateString + payment.note)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					on:click={() => rowClicked(payment)}
					class="pay-table__row pay-table__row_clickable"
					role="rowgroup"
				>
					<div class="pay-table__column pay-table__amount" role="cell">
						<NumberFormat value={payment.amount} />
					</div>
					<div class="pay-table__column pay-table__date" role="cell">
						{payment.dateString}
					</div>
					{#if showUsdColumn}
						<div class="pay-table__column pay-table__usd" role="cell">
							{#if payment.usdAmount}
								<NumberFormat value={payment.usdAmount} />
							{:else}
								Loading...
							{/if}
						</div>
					{/if}
					<div class="pay-table__column pay-table__note" role="cell">
						{payment.note ?? '-'}
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	Loading payments...
{/if}

<style>
	.pay-table {
		width: 100%;
		padding-top: 8px;
		padding-bottom: 16px;
	}

	.pay-table__title {
		margin-left: 16px;
		text-decoration: underline;
		font-size: 18px;
		margin-bottom: 8px;
	}

	.pay-table__table {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		row-gap: 8px;
	}

	.pay-table__table_4-columns .pay-table__column {
		width: 25%;
	}

	.pay-table__table_3-columns .pay-table__column {
		width: 33%;
	}

	.pay-table__row {
		width: 100%;
		max-height: 48px;
		display: flex;
	}

	.pay-table__row_clickable {
		cursor: pointer;
	}

	.pay-table__row_clickable:hover {
		background-color: #eee;
	}

	.pay-table__column {
		text-align: center;
		text-wrap: nowrap;
		overflow-x: auto;
	}
</style>
