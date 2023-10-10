<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { ServiceItem } from '@/lib/util/logic/item';
	import type { IPayment, IService } from '@/lib/typings';
	import { ItemService } from '@/lib/services/item.service';
	import PaymentTable from './util/payment-table.svelte';

	export let data: IService;
	const dispatch = createEventDispatcher();

	let ui: {
		showRegisterPaymentButton?: boolean;
		payWindow?: {
			dateInputString: string;
			note?: string;
			editing?: {
				originalPayment: IPayment;
			};
		};
		lastPayment?: IPayment;
		showChangePaidDateButton?: boolean;
		tabs: { readonly list: ITab[]; show?: boolean; activeTab: TabType };
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
			ui.showRegisterPaymentButton = !monthPaid;
			ui.showChangePaidDateButton = monthPaid;
		} else {
			ui.showRegisterPaymentButton = true;
		}
		ui.tabs.show = data.payments && data.payments.length > 1;
	}

	function registerPaymentClicked() {
		ui.showRegisterPaymentButton = false;
		const date = new Date(Date.now());

		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		ui.payWindow = {
			dateInputString: date.toISOString().substring(0, 10)
		};
	}
	function changePaidDateClicked() {
		ui.showChangePaidDateButton = false;
		const date = new Date(ServiceItem.getLastPayment(data.payments!).dateString);

		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		ui.payWindow = {
			dateInputString: date.toISOString().substring(0, 10)
		};
	}
	function confirmPayment() {
		const window = ui.payWindow!;
		const date = new Date(window.dateInputString + 'T00:00');

		const newPayment: IPayment = {
			dateString: date.toLocaleDateString(),
			amount: data.cost,
			note: window.note
		};
		const payments = data.payments ?? [];

		// If we have an original payment, we are editing
		if (!window.editing) {
			payments.push(newPayment);
			if (!data.payments) {
				data.payments = payments;
			}
		} else {
			// Just edit the original object before saving the array that includes it
			window.editing.originalPayment.amount = newPayment.amount;
			window.editing.originalPayment.dateString = newPayment.dateString;
			window.editing.originalPayment.note = newPayment.note;
		}

		ItemService.update(data._id, { payments });

		ui.payWindow = undefined;
		ui.lastPayment = newPayment;

		checkPayStatus();

		triggerOnUpdate();
	}
	function triggerOnUpdate() {
		dispatch('update', data);
	}

	function cancelPaidDateMark() {
		ui.payWindow = undefined;
		ui.showRegisterPaymentButton = true;
	}

	function tabClicked(tab: ITab) {
		ui.tabs.list.forEach((t) => (t.active = false));
		tab.active = true;
		ui.tabs.activeTab = tab.type;
	}

	function paymentRowClicked(payment: IPayment) {}

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
				{#if ui.showRegisterPaymentButton}
					<button on:click={registerPaymentClicked} class="button">Register Payment</button>
				{/if}
				{#if ui.payWindow}
					<div class="pay-window">
						<div class="pay-window__body">
							<!-- Set Date -->
							<input
								bind:value={ui.payWindow.dateInputString}
								type="date"
								class="input"
								placeholder="Date"
							/>

							<!-- Optional Note -->
							<input
								bind:value={ui.payWindow.note}
								type="text"
								class="input"
								placeholder="Note (optional)"
							/>
						</div>

						<div class="pay-window__footer">
							<button on:click={confirmPayment} class="button is-primary">Confirm</button>
							<button on:click={cancelPaidDateMark} class="button">Cancel</button>
						</div>
					</div>
				{/if}
				{#if ui.showChangePaidDateButton}
					<button on:click={changePaidDateClicked} class="button">Change Date</button>
				{/if}
			</div>
		{/if}

		<!-- Payments -->
		{#if ui.tabs.activeTab === 'payments'}
			<PaymentTable payments={data.payments} onRowClicked={paymentRowClicked} />
		{/if}
	</div>
{/if}

<style>
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

	.pay-window__body {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.pay-window__footer {
		margin-top: 16px;
		display: flex;
		justify-content: space-between;
		gap: 16px;
	}

	.service-tabs {
		width: 100%;
	}
</style>
