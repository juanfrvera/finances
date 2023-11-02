<script lang="ts">
	import NumberFormat from '@/lib/components/number-format.svelte';
	import type { IPayment } from '@/lib/util/typings/payment.typings';

	export let onRowClicked: (transaction: IPayment) => any;
	export let rows: IPayment[] | undefined;

	function rowClicked(row: IPayment) {
		onRowClicked(row);
	}
</script>

{#if rows}
	{#if rows.length}
		<div class="transaction-table">
			<div class="transaction-table__table transaction-table__table_4-columns" role="table">
				<div class="transaction-table__header transaction-table__row" role="rowgroup">
					<div class="transaction-table__column">Amount</div>
					<div class="transaction-table__column">Date</div>
					<div class="transaction-table__column">Type</div>
					<div class="transaction-table__column">Notes</div>
				</div>

				{#each rows as row (row._id + '//' + row.amount + '//' + row.dateString + row.note)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						on:click={() => rowClicked(row)}
						class="transaction-table__row transaction-table__row_clickable"
						role="rowgroup"
					>
						<div class="transaction-table__column transaction-table__amount" role="cell">
							<NumberFormat value={row.amount} />
						</div>
						<div class="transaction-table__column transaction-table__date" role="cell">
							{row.dateString}
						</div>
						<div class="transaction-table__column transaction-table__type" role="cell">
							{row.transactionType}
						</div>
						<div class="transaction-table__column transaction-table__note" role="cell">
							{row.note ?? '-'}
						</div>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		You don't have transactions yet
	{/if}
{:else}
	Loading transactions...
{/if}

<style>
	.transaction-table {
		width: 100%;
		padding-top: 8px;
		padding-bottom: 16px;
	}

	.transaction-table__table {
		width: 100%;
		display: flex;
		flex-flow: row wrap;
		row-gap: 8px;
	}

	.transaction-table__table_4-columns .transaction-table__column {
		width: 25%;
	}

	.transaction-table__row {
		width: 100%;
		max-height: 48px;
		display: flex;
	}

	.transaction-table__row_clickable {
		cursor: pointer;
	}

	.transaction-table__row_clickable:hover {
		background-color: #eee;
	}

	.transaction-table__column {
		text-align: center;
		text-wrap: nowrap;
		overflow-x: auto;
	}
</style>
