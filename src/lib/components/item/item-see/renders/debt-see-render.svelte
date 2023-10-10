<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { IDebt, IPayment } from '@/lib/typings';
	import { DebtLogic } from '@/lib/util/logic/debt';
	import NumberFormat from '@/lib/components/number-format.svelte';
	import { ItemService } from '@/lib/services/item.service';
	import { ModalChannel } from '@/lib/services/modal-channel.service';
	import type { Subscription } from 'rxjs';
	import PaymentTable from './util/payment-table.svelte';

	export let data: IDebt;
	const dispatch = createEventDispatcher();

	let ui: {
		payStatus?: {
			amount: number;
			total: number;
			isPaid: boolean;
			statusString: string;
		};
		showPayButton?: boolean;
		payWindow?: {
			dateInputString: string;
			amount: number;
			note?: string;
			saving?: boolean;
			editing?: {
				originalPayment: IPayment;
			};
		};
		payInfo?: string;
		showPayTable?: boolean;
	} = {};

	let subscription: Subscription;

	onMount(() => {
		subscription = ModalChannel.$channel.subscribe((signal) => {
			if (signal.type === 'itemEdited') {
				checkPayStatus();
			}
		});
		checkPayStatus();
	});

	onDestroy(() => {
		if (subscription) subscription.unsubscribe();
	});

	function checkPayStatus() {
		const paidAmount = DebtLogic.getPaidAmount(data);
		const isPaid = paidAmount >= data.amount;

		ui.showPayButton = !isPaid;
		ui.payInfo = DebtLogic.calculatePayStateString(data);
		if (data.description && data.description.length > 0) {
			ui.payInfo += ` ${data.description}`;
		}

		ui.showPayTable = data.payments && data.payments.length > 0;

		ui.payStatus = {
			isPaid,
			amount: (data.theyPayMe && isPaid) || isPaid ? paidAmount : data.amount - paidAmount,
			total: data.amount,
			statusString: DebtLogic.calculatePayStateString(data)
		};
	}

	function cancelPay() {
		ui.payWindow = undefined;
		ui.showPayButton = true;
		ui.showPayTable = true;
	}

	async function confirmPay() {
		const payWindow = ui.payWindow!;
		payWindow.saving = true;
		try {
			const newPayment: IPayment = {
				dateString: payWindow.dateInputString,
				amount: payWindow.amount,
				note: payWindow.note
			};
			const payments = data.payments ?? [];

			// If we have an original payment, we are editing
			if (!payWindow.editing) {
				payments.push(newPayment);
				if (!data.payments) {
					data.payments = payments;
				}
			} else {
				// Just edit the original object before saving the array that includes it
				payWindow.editing.originalPayment.amount = newPayment.amount;
				payWindow.editing.originalPayment.dateString = newPayment.dateString;
				payWindow.editing.originalPayment.note = newPayment.note;
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

	function paymentRowClicked(payment: IPayment) {
		ui.showPayTable = false;
		ui.payWindow = {
			dateInputString: payment.dateString,
			amount: payment.amount,
			note: payment.note,
			editing: { originalPayment: payment }
		};
		ui.showPayButton = false;
	}

	function deleteCurrentPayment() {
		const payment = ui.payWindow!.editing!.originalPayment;
		data.payments!.splice(data.payments!.indexOf(payment), 1);
		ItemService.update(data._id, { payments: data.payments });
		ui.payWindow = undefined;
		checkPayStatus();
	}
</script>

{#if ui != null}
	<div class="debt-see">
		<div>{ui.payInfo}</div>
		{#if ui.payStatus}
			<div>
				{ui.payStatus.statusString}
				<NumberFormat value={ui.payStatus.amount} /> of <NumberFormat value={ui.payStatus.total} />
				{data.currency}
			</div>
		{/if}

		<!-- Pay Table -->
		{#if ui.showPayTable && data.payments && data.payments.length}
			<PaymentTable payments={data.payments} onRowClicked={paymentRowClicked} />
		{/if}

		<!-- Pay Window -->
		{#if ui.payWindow}
			<div class="pay-window">
				{#if ui.payWindow.editing}
					<div class="pay-window__editing-header">
						<div class="pay-window__editing-title">Editing Payment</div>
						<button on:click={deleteCurrentPayment} class="button">Delete</button>
					</div>
				{/if}
				<input
					bind:value={ui.payWindow.dateInputString}
					type="date"
					class="input"
					placeholder="Date"
				/>
				<input bind:value={ui.payWindow.amount} class="input" type="number" placeholder="Amount" />
				<input bind:value={ui.payWindow.note} class="input" type="text" placeholder="Note" />
				<div class="pay-window__footer">
					<button on:click={confirmPay} class="button {ui.payWindow.saving ? 'is-loading' : ''}"
						>Confirm</button
					>
					<button on:click={cancelPay} disabled={ui.payWindow.saving} class="button is-danger"
						>Cancel</button
					>
				</div>
			</div>
		{/if}

		<!-- Add Payment -->
		{#if ui.showPayButton}
			<button on:click={payClicked} class="button">Register payment</button>
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

	.pay-window__editing-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.pay-window__footer {
		margin-top: 8px;
		display: flex;
		justify-content: space-around;
	}
</style>
