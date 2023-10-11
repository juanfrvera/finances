<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { ServiceItem } from '@/lib/util/logic/item';
	import type { IService } from '@/lib/typings';
	import { ItemService } from '@/lib/services/item.service';
	import PaymentTable from './util/payment-table.svelte';
	import PayWindow from './util/pay-window.svelte';
	import type { IPayWindow, IPayment } from '@/lib/util/typings/payment.typings';

	export let data: IService;
	const dispatch = createEventDispatcher();

	let ui: {
		showPayButton?: boolean;
		payWindow?: IPayWindow;
		lastPayment?: IPayment;
		showChangePaidDateButton?: boolean;
		tabs: { readonly list: ITab[]; show?: boolean; activeTab: TabType };
		showPayTable?: boolean;
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
			ui.lastPayment = ServiceItem.getLastPayment(data.payments);
			const monthPaid = ServiceItem.wasThisMonthPaid(data);
			ui.showPayButton = !monthPaid;
			ui.showChangePaidDateButton = monthPaid;
		} else {
			ui.showPayButton = true;
		}
		ui.tabs.show = ui.showPayTable = data.payments && data.payments.length > 1;
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
		const lastPayment = ServiceItem.getLastPayment(data.payments!);

		ui.payWindow = {
			editedPayment: lastPayment,
			defaultAmount: lastPayment.amount
		};
	}

	function confirmPay(payment: IPayment) {
		const payWindow = ui.payWindow!;
		if (!data.payments) data.payments = [];

		// If we have an original payment, we are editing
		if (!payWindow.editedPayment) {
			data.payments = [...data.payments, payment];
		} else {
			// Just edit the original object before saving the array that includes it
			payWindow.editedPayment.amount = payment.amount;
			payWindow.editedPayment.dateString = payment.dateString;
			payWindow.editedPayment.note = payment.note;
		}

		ItemService.update(data._id, { payments: data.payments });

		ui.payWindow = undefined;
		ui.lastPayment = payment;

		checkPayStatus();
		triggerOnUpdate();
	}

	function triggerOnUpdate() {
		dispatch('update', data);
	}

	function cancelPay() {
		ui.payWindow = undefined;
		ui.showPayButton = true;
		ui.showPayTable = true;
	}

	function deletePayment() {
		const payment = ui.payWindow!.editedPayment!;
		data.payments!.splice(data.payments!.indexOf(payment), 1);
		ItemService.update(data._id, { payments: data.payments });
		ui.payWindow = undefined;
		checkPayStatus();
	}

	function tabClicked(tab: ITab) {
		ui.tabs.list.forEach((t) => (t.active = false));
		tab.active = true;
		ui.tabs.activeTab = tab.type;
	}

	function paymentRowClicked(payment: IPayment) {
		ui.showPayTable = false;
		ui.payWindow = {
			editedPayment: payment,
			defaultAmount: payment.amount
		};
		ui.showPayButton = false;
	}

	interface ITab {
		title: string;
		active?: boolean;
		type: TabType;
	}
	type TabType = 'main' | 'payments';
</script>

{#if ui}
	<div class="service-see">
		{#if ui.tabs.show}
			<div class="service-tabs tabs">
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
		{#if ui.tabs.activeTab === 'payments' && ui.showPayTable}
			<PaymentTable payments={data.payments} onRowClicked={paymentRowClicked} />
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

	.service-tabs {
		width: 100%;
	}
</style>
