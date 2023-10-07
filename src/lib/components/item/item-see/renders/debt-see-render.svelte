<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { IDebt, IPayment } from '@/lib/typings';
	import { DebtLogic } from '@/lib/util/logic/debt';
	import NumberFormat from '@/lib/components/number-format.svelte';
	import { ItemService } from '@/lib/services/item.service';
	import { flatMap } from 'rxjs';

	export let data: IDebt;
	const dispatch = createEventDispatcher();

	let ui: {
		isPaid?: boolean;
		showPayButton?: boolean;
		payWindow?: {
			dateInputString: string;
			amount: number;
			saving?: boolean;
			originalPayment?: IPayment;
		};
		payInfo?: string;
		payments?: Array<IPaymentRow>;
		showPayTable?: boolean;
	} = {};
	interface IPaymentRow {
		amount: number;
		date: string;
		note: string;
		paymentObject: IPayment;
	}

	onMount(() => {
		checkPayStatus();
	});

	function checkPayStatus() {
		let paidAmount = 0;
		if (data.payments) {
			data.payments.forEach((p) => (paidAmount += p.amount));
		}
		const isPaid = paidAmount >= data.amount;

		ui.isPaid = isPaid;
		ui.showPayButton = !isPaid;
		ui.payInfo = DebtLogic.calculatePayStateString(data);
		if (data.description && data.description.length > 0) {
			ui.payInfo += ` ${data.description}`;
		}

		if (data.payments) {
			ui.payments = data.payments.map((p) => ({
				amount: p.amount,
				date: p.dateString,
				note: p.note ?? '',
				paymentObject: p
			}));
			ui.showPayTable = true;
		} else {
			ui.payments = undefined;
			ui.showPayTable = false;
		}
	}

	async function confirmPay() {
		const payWindow = ui.payWindow!;
		payWindow.saving = true;
		try {
			const newPayment: IPayment = {
				dateString: payWindow.dateInputString,
				amount: payWindow.amount
			};
			const payments = data.payments ?? [];

			// If we have an original payment, we are editing
			if (!payWindow.originalPayment) {
				payments.push(newPayment);
			} else {
				// Just edit the original object before saving the array that includes it
				payWindow.originalPayment.amount = newPayment.amount;
				payWindow.originalPayment.dateString = newPayment.dateString;
				payWindow.originalPayment.note = newPayment.note;
			}
			ItemService.update(data._id, { payments });

			checkPayStatus();

			ui.payWindow = undefined;
			triggerOnUpdate();
		} catch (error) {
			console.error(error);
			payWindow.saving = false;
		}
	}
	function openPayWindow(date: Date) {
		ui.payWindow = {
			// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
			dateInputString: date.toISOString().substring(0, 10),
			amount: 0
		};
	}
	function triggerOnUpdate() {
		dispatch('update', data);
	}
	function payClicked() {
		ui.showPayButton = false;
		openPayWindow(new Date(Date.now()));
	}

	function paymentRowClicked(row: IPaymentRow) {
		ui.showPayTable = false;
		ui.payWindow = {
			dateInputString: row.paymentObject.dateString,
			amount: row.paymentObject.amount,
			originalPayment: row.paymentObject
		};
	}
</script>

{#if ui != null}
	<div class="debt-see">
		<div>{ui.payInfo}</div>
		<div><NumberFormat value={data.amount} /> {data.currency}</div>
		{#if ui.showPayButton}
			<button class="button" on:click={payClicked}>Pay</button>
		{/if}
		{#if ui.payWindow}
			<input
				bind:value={ui.payWindow.dateInputString}
				type="date"
				class="input"
				placeholder="Date"
			/>
			<input bind:value={ui.payWindow.amount} class="input" type="number" placeholder="Amount" />
			<button on:click={confirmPay} class="button {ui.payWindow.saving ? 'is-loading' : ''}"
				>Confirm</button
			>
		{/if}

		<!-- Pay Table -->
		{#if ui.showPayTable && ui.payments && ui.payments.length}
			<div class="pay-table">
				<div class="pay-table__title">Payments</div>
				<div class="pay-table__table">
					<div class="pay-table__row">
						<div class="pay-table__column">Amount</div>
						<div class="pay-table__column">Date</div>
						<div class="pay-table__column">Notes</div>
					</div>

					{#each ui.payments as payment (payment.amount + '//' + payment.date + payment.note)}
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<div
							on:click={() => paymentRowClicked(payment)}
							class="pay-table__row pay-table__row_clickable"
						>
							<div class="pay-table__column pay-table__amount">
								<NumberFormat value={payment.amount} />
							</div>
							<div class="pay-table__column pay-table__date">{payment.date}</div>
							<div class="pay-table__column pay-table__note">{payment.note}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
{/if}

<style>
	.debt-see {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 8px;
	}

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
