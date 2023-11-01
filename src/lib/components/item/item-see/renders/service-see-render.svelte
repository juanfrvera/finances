<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { ServiceItem } from '@/lib/util/logic/item';
	import type { IService } from '@/lib/typings';
	import { ItemService } from '@/lib/services/item.service';
	import PaymentTable from './util/payment-table.svelte';
	import PayWindow from './util/pay-window.svelte';
	import type { IPayTable, IPayWindow, IPayment } from '@/lib/util/typings/payment.typings';
	import { PaymentLogic } from '@/lib/util/logic/payment.logic';
	import type { ITab } from '@/lib/util/typings/tab.typings';

	export let data: IService;
	const dispatch = createEventDispatcher();

	let ui: {
		showPayButton?: boolean;
		payWindow?: IPayWindow;
		lastPayment?: IPayment;
		showChangePaidDateButton?: boolean;
		tabs: { readonly list: ITab<TabType>[]; show?: boolean; activeTab: TabType };
		payTable?: IPayTable;
	} = {
		tabs: {
			list: [
				{ title: 'Service', active: true, type: 'main' },
				{ title: 'Payments', type: 'payments' }
			],
			activeTab: 'main'
		}
	};

	onMount(() => {
		checkPayStatus();
	});

	function checkPayStatus() {
		if (!data.isManual) return;
		if (data.payments) {
			ui.lastPayment = PaymentLogic.getLastPayment(data.payments);
			const monthPaid = ServiceItem.wasThisMonthPaid(data);
			ui.showPayButton = !monthPaid;
			ui.showChangePaidDateButton = monthPaid;
		} else {
			ui.showPayButton = true;
		}
		ui.payTable = PaymentLogic.getPayTable(data.payments, data.currency, ui.payTable);
		ui.tabs.show = data.payments && data.payments.length > 1;
	}

	function registerPaymentClicked() {
		ui.showPayButton = false;

		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		ui.payWindow = {
			defaultAmount: data.cost
		};
	}
	function changePaidDateClicked() {
		ui.showChangePaidDateButton = false;
		const lastPayment = PaymentLogic.getLastPayment(data.payments!);

		ui.payWindow = {
			editedPayment: lastPayment,
			defaultAmount: lastPayment!.amount
		};
	}

	async function confirmPay(payment: IPayment) {
		await PaymentLogic.addPayment(data, payment, ui.payWindow!, ui.payTable);

		ui.payWindow = undefined;
		ui.lastPayment = PaymentLogic.getLastPayment(data.payments!);

		checkPayStatus();
		triggerOnUpdate();
	}

	function triggerOnUpdate() {
		dispatch('update', data);
	}

	function cancelPay() {
		ui.payWindow = undefined;
		ui.showPayButton = true;
		if (ui.payTable) ui.payTable.show = true;
	}

	function deletePayment() {
		const payment = ui.payWindow!.editedPayment!;
		data.payments!.splice(data.payments!.indexOf(payment), 1);
		ItemService.update(data._id, { payments: data.payments });
		ui.payWindow = undefined;
		checkPayStatus();
	}

	function tabClicked(tab: ITab<TabType>) {
		ui.tabs.list.forEach((t) => (t.active = false));
		tab.active = true;
		ui.tabs.activeTab = tab.type;
	}

	function paymentRowClicked(payment: IPayment) {
		ui.payTable!.show = false;
		ui.payWindow = {
			editedPayment: payment,
			defaultAmount: payment.amount
		};
		ui.showPayButton = false;
	}
	type TabType = 'main' | 'payments';
</script>

{#if ui}
	<div class="service-see">
		{#if ui.tabs.show}
			<div class="see-tabs tabs">
				<ul>
					{#each ui.tabs.list as tab}
						<li class={tab.active ? 'is-active' : ''}>
							<!-- svelte-ignore a11y-missing-attribute -->
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<a on:click={() => tabClicked(tab)}>{tab.title}</a>
						</li>
					{/each}
				</ul>
			</div>
		{/if}

		<!-- Main -->
		{#if ui.tabs.activeTab === 'main'}
			<div class="service-see__body">
				<div>{data.name}</div>
				<div>{data.cost} {data.currency}</div>
				{#if ui.lastPayment}
					<div class="label-and-value">
						<div class="value-label">Last pay date:</div>
						<div class="value">{ui.lastPayment.dateString}</div>
					</div>
				{/if}
				{#if ui.showChangePaidDateButton}
					<button on:click={changePaidDateClicked} class="button">Change Date</button>
				{/if}
			</div>
		{/if}

		<!-- Payments -->
		{#if ui.tabs.activeTab === 'payments' && ui.payTable && ui.payTable.show}
			<PaymentTable
				payments={ui.payTable.payments}
				showUsdColumn={ui.payTable.showUsdColumn}
				onRowClicked={paymentRowClicked}
			/>
		{/if}

		{#if ui.payWindow}
			<PayWindow
				editedPayment={ui.payWindow.editedPayment}
				defaultAmount={ui.payWindow.defaultAmount}
				onConfirm={confirmPay}
				onCancel={cancelPay}
				onDelete={deletePayment}
			/>
		{/if}

		{#if ui.showPayButton}
			<button on:click={registerPaymentClicked} class="button">Register Payment</button>
		{/if}
	</div>
{/if}

<style>
	.service-see {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.service-see__body {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 8px;
	}

	.label-and-value {
		display: flex;
		column-gap: 8px;
	}
</style>
