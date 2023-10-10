<script lang="ts">
	import NumberFormat from '@/lib/components/number-format.svelte';
	import type { IPayment } from '@/lib/typings';

	export let onRowClicked: (payment: IPayment) => any;
	export let payments: IPayment[] | undefined;

	function rowClicked(payment: IPayment) {
		onRowClicked(payment);
	}
</script>

{#if payments}
	<div class="pay-table">
		<div class="pay-table__title">Payments</div>
		<div class="pay-table__table">
			<div class="pay-table__row">
				<div class="pay-table__column">Amount</div>
				<div class="pay-table__column">Date</div>
				<div class="pay-table__column">Notes</div>
			</div>

			{#each payments as payment (payment.amount + '//' + payment.dateString + payment.note)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div on:click={() => rowClicked(payment)} class="pay-table__row pay-table__row_clickable">
					<div class="pay-table__column pay-table__amount">
						<NumberFormat value={payment.amount} />
					</div>
					<div class="pay-table__column pay-table__date">{payment.dateString}</div>
					<div class="pay-table__column pay-table__note">
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
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 16px;
	}

	.pay-table__title {
		text-decoration: underline;
		font-size: 18px;
		margin-bottom: 8px;
	}

	.pay-table__table {
		display: table;
		width: 100%;
	}

	.pay-table__row {
		height: 16px;
		display: table-row;
		justify-content: center;
	}

	.pay-table__row_clickable {
		cursor: pointer;
	}

	.pay-table__row_clickable:hover {
		background-color: #eee;
	}

	.pay-table__column {
		text-align: center;
		display: table-cell;
	}
</style>
