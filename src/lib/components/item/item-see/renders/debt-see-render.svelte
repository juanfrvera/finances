<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { IDebt } from '@/lib/typings';
	import { DebtLogic } from '@/lib/util/logic/debt';
	import NumberFormat from '@/lib/components/number-format.svelte';
	import { ItemService } from '@/lib/services/item.service';
	import { ItemChannel } from '@/lib/services/channel.service';
	import type { Subscription } from 'rxjs';
	import PaymentTable from './util/payment-table.svelte';
	import PayWindow from './util/pay-window.svelte';
	import type { IPayTable, IPayWindow, IPayment } from '@/lib/util/typings/payment.typings';
	import { PaymentLogic } from '@/lib/util/logic/payment.logic';

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
		payTable?: IPayTable;
	} = {};

	let subscription: Subscription;

	onMount(() => {
		subscription = ItemChannel.$channel.subscribe((signal) => {
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

		ui.payTable = PaymentLogic.getPayTable(data.payments, data.currency, ui.payTable);

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
		if (ui.payTable) ui.payTable.show = true;
	}

	async function confirmPay(payment: IPayment) {
		const payWindow = ui.payWindow!;
		try {
			await PaymentLogic.savePayment(data, payment, payWindow, ui.payTable);

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
		ui.payTable!.show = false;
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
		{#if ui.payTable && ui.payTable.show}
			<PaymentTable
				payments={ui.payTable.payments}
				showUsdColumn={ui.payTable.showUsdColumn}
				onRowClicked={paymentRowClicked}
			/>
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
