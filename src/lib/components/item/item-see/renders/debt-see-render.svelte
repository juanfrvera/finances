<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { IDebt } from '@/lib/typings';
	import { DebtLogic } from '@/lib/util/logic/debt';
	import NumberFormat from '@/lib/components/number-format.svelte';
	import { ItemService } from '@/lib/services/item.service';
	import { ModalChannel } from '@/lib/services/modal-channel.service';
	import type { Subscription } from 'rxjs';
	import PaymentTable from './util/payment-table.svelte';
	import PayWindow from './util/pay-window.svelte';
	import type { IPayWindow, IPayment } from '@/lib/util/typings/payment.typings';

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
		payWindow?: IPayWindow;
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

	async function confirmPay(payment: IPayment) {
		const payWindow = ui.payWindow!;
		payWindow.saving = true;
		try {
			const payments = data.payments ?? [];

			// If we have an original payment, we are editing
			if (!payWindow.editedPayment) {
				payments.push(payment);
				if (!data.payments) {
					data.payments = payments;
				}
			} else {
				// Just edit the original object before saving the array that includes it
				payWindow.editedPayment.amount = payment.amount;
				payWindow.editedPayment.dateString = payment.dateString;
				payWindow.editedPayment.note = payment.note;
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
	function triggerOnUpdate() {
		dispatch('update', data);
	}
	function payClicked() {
		ui.showPayButton = false;
		ui.payWindow = {
			defaultAmount: DebtLogic.getOwedAmountOrZero(data)
		};
	}

	function paymentRowClicked(payment: IPayment) {
		ui.showPayTable = false;
		ui.payWindow = {
			editedPayment: payment,
			defaultAmount: payment.amount
		};
		ui.showPayButton = false;
	}

	function deleteCurrentPayment() {
		const payment = ui.payWindow!.editedPayment!;
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
			<PayWindow
				editedPayment={ui.payWindow.editedPayment}
				defaultAmount={ui.payWindow.defaultAmount}
				onConfirm={confirmPay}
				onCancel={cancelPay}
				onDelete={deleteCurrentPayment}
			/>
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
</style>
