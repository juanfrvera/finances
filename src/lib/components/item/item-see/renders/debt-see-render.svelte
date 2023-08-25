<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { IDebtConfig, IItemData } from '../../../../typings';
	import { DebtLogic } from '@/lib/util/logic/debt';
	import NumberFormat from '@/lib/components/number-format.svelte';

	export let data: IItemData<IDebtConfig>;
	const dispatch = createEventDispatcher();

	let view: {
		payDate?: {
			showPaidDate: boolean;
			showMarkAsPaidButton: boolean;
			markPaidDatePicker?: {
				dateInputString: string;
			};
			showChangePaidDateButton: boolean;
		};
		payInfo?: string;
	} = {};

	onMount(() => {
		const isPaid = data.config.paidDate != null;
		view.payDate = {
			showPaidDate: isPaid,
			showMarkAsPaidButton: !isPaid,
			showChangePaidDateButton: isPaid
		};

		view.payInfo = DebtLogic.calculatePayStateString(data);
		if (data.config.description && data.config.description.length > 0) {
			view.payInfo += ` ${data.config.description}`;
		}
	});

	function markAsPaidClicked() {
		view.payDate!.showMarkAsPaidButton = false;
		openMarkPaidDatePicker(new Date(Date.now()));
	}
	function changePaidDateClicked() {
		view.payDate!.showChangePaidDateButton = false;
		openMarkPaidDatePicker(new Date(data.config.paidDate));
	}
	function confirmPaidDate() {
		const date = new Date(view.payDate!.markPaidDatePicker!.dateInputString + 'T00:00');
		data.config.paidDate = date.toLocaleDateString();

		view.payDate!.markPaidDatePicker = undefined;
		view.payDate!.showChangePaidDateButton = true;
		view.payDate!.showPaidDate;

		triggerOnUpdate();
	}
	function openMarkPaidDatePicker(date: Date) {
		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		view.payDate!.markPaidDatePicker = {
			dateInputString: date.toISOString().substring(0, 10)
		};
	}
	function triggerOnUpdate() {
		dispatch('update', data);
	}
</script>

{#if view != null}
	<div class="debt-see">
		<div>{view.payInfo}</div>
		<div><NumberFormat value={data.config.amount} /> {data.config.currency}</div>
		{#if view.payDate != undefined}
			{#if view.payDate.showPaidDate}
				<div class="label-and-value">
					<div class="value-label">Paid date:</div>
					<div class="value">{data.config.paidDate}</div>
				</div>
			{/if}
			{#if view.payDate.showMarkAsPaidButton}
				<button on:click={markAsPaidClicked}>Mark as Paid</button>
			{/if}
			{#if view.payDate.markPaidDatePicker != undefined}
				<input bind:value={view.payDate.markPaidDatePicker.dateInputString} type="date" />
				<button on:click={confirmPaidDate}>Confirm date</button>
			{/if}
			{#if view.payDate.showChangePaidDateButton}
				<button on:click={changePaidDateClicked}>Change Date</button>
			{/if}
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

	.label-and-value {
		display: flex;
		column-gap: 8px;
	}
</style>
