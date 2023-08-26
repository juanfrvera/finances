<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { IDebt } from '@/lib/typings';
	import { DebtLogic } from '@/lib/util/logic/debt';
	import NumberFormat from '@/lib/components/number-format.svelte';
	import { ItemService } from '@/lib/services/item.service';

	export let data: IDebt;
	const dispatch = createEventDispatcher();

	let ui: {
		payDate?: {
			showPaidDate?: boolean;
			showMarkAsPaidButton?: boolean;
			markAsPaid?: {
				dateInputString: string;
				marking?: boolean;
			};
			showChangePaidDateButton?: boolean;
		};
		payInfo?: string;
	} = {};

	onMount(() => {
		const isPaid = data.paidDate != null;
		ui.payDate = {
			showPaidDate: isPaid,
			showMarkAsPaidButton: !isPaid,
			showChangePaidDateButton: isPaid
		};

		ui.payInfo = DebtLogic.calculatePayStateString(data);
		if (data.description && data.description.length > 0) {
			ui.payInfo += ` ${data.description}`;
		}
	});

	function markAsPaidClicked() {
		ui.payDate!.showMarkAsPaidButton = false;
		openMarkPaidDatePicker(new Date(Date.now()));
	}
	function changePaidDateClicked() {
		ui.payDate!.showChangePaidDateButton = false;
		openMarkPaidDatePicker(new Date(data.paidDate ?? Date.now()));
	}
	async function confirmPaidDate() {
		const dateString = ui.payDate!.markAsPaid!.dateInputString;
		const date = new Date(dateString + 'T00:00');

		ui.payDate!.markAsPaid!.marking = true;
		try {
			ItemService.update(data._id, { paidDate: dateString });
			data.paidDate = date.toLocaleDateString();

			ui.payDate!.markAsPaid = undefined;
			ui.payDate!.showChangePaidDateButton = true;
			ui.payDate!.showPaidDate = true;
		} catch (error) {
			ui.payDate!.markAsPaid!.marking = false;
		}

		triggerOnUpdate();
	}
	function openMarkPaidDatePicker(date: Date) {
		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		ui.payDate!.markAsPaid = {
			dateInputString: date.toISOString().substring(0, 10)
		};
	}
	function triggerOnUpdate() {
		dispatch('update', data);
	}
</script>

{#if ui != null}
	<div class="debt-see">
		<div>{ui.payInfo}</div>
		<div><NumberFormat value={data.amount} /> {data.currency}</div>
		{#if ui.payDate != undefined}
			{#if ui.payDate.showPaidDate}
				<div class="label-and-value">
					<div class="value-label">Paid date:</div>
					<div class="value">{data.paidDate}</div>
				</div>
			{/if}
			{#if ui.payDate.showMarkAsPaidButton}
				<button on:click={markAsPaidClicked}>Mark as Paid</button>
			{/if}
			{#if ui.payDate.markAsPaid}
				<input bind:value={ui.payDate.markAsPaid.dateInputString} type="date" />
				<button
					on:click={confirmPaidDate}
					class="button {ui.payDate.markAsPaid.marking ? 'is-loading' : ''}">Confirm date</button
				>
			{/if}
			{#if ui.payDate.showChangePaidDateButton}
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
