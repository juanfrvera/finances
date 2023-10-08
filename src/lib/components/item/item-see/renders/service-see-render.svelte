<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { ServiceItem } from '@/lib/util/logic/item';
	import type { IService } from '@/lib/typings';

	export let data: IService;
	const dispatch = createEventDispatcher();

	let ui: IView;
	onMount(() => {
		ui = {};
		if (data.isManual) {
			let lastPayDateString = 'Never';
			let showMarkAsPaidButton = true;
			if (data.lastPayDateString != null) {
				const lastPayDate = new Date(data.lastPayDateString);
				showMarkAsPaidButton = data.isManual && !ServiceItem.wasThisMonthPaid(data);
				lastPayDateString = data.lastPayDateString;
			}

			ui.payDate = {
				lastPayDateString,
				showMarkAsPaidButton,
				showChangePaidDateButton: !showMarkAsPaidButton
			};
		}
	});

	function markAsPaidClicked() {
		ui.payDate!.showMarkAsPaidButton = false;
		openMarkPaidDatePicker(new Date(Date.now()));
	}
	function changePaidDateClicked() {
		ui.payDate!.showChangePaidDateButton = false;
		openMarkPaidDatePicker(new Date(data.lastPayDateString));
	}
	function confirmPaidDate() {
		const date = new Date(ui.payDate!.markPaidDatePicker!.dateInputString + 'T00:00');
		data.lastPayDateString = date.toLocaleDateString();
		ui.payDate!.lastPayDateString = data.lastPayDateString;

		ui.payDate!.markPaidDatePicker = undefined;
		ui.payDate!.showChangePaidDateButton = true;
		triggerOnUpdate();
	}
	function openMarkPaidDatePicker(date: Date) {
		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		ui.payDate!.markPaidDatePicker = {
			dateInputString: date.toISOString().substring(0, 10)
		};
	}
	function triggerOnUpdate() {
		dispatch('update', data);
	}

	function cancelPaidDateMark() {
		ui.payDate!.markPaidDatePicker = undefined;
		ui.payDate!.showMarkAsPaidButton = true;
	}

	interface IView {
		payDate?: {
			lastPayDateString: string;
			showMarkAsPaidButton: boolean;
			markPaidDatePicker?: {
				dateInputString: string;
			};
			showChangePaidDateButton: boolean;
		};
	}
</script>

{#if ui != null}
	<div class="service-see">
		<div>{data.name}</div>
		<div>{data.cost} {data.currency}</div>
		{#if ui.payDate != undefined}
			<div class="label-and-value">
				<div class="value-label">Last pay date:</div>
				<div class="value">{ui.payDate.lastPayDateString}</div>
			</div>
			{#if ui.payDate.showMarkAsPaidButton}
				<button on:click={markAsPaidClicked} class="button">Mark as Paid</button>
			{/if}
			{#if ui.payDate.markPaidDatePicker != undefined}
				<div class="mark-paid-window">
					<input
						bind:value={ui.payDate.markPaidDatePicker.dateInputString}
						type="date"
						class="input"
					/>
					<div class="mark-paid-window__footer">
						<button on:click={confirmPaidDate} class="button">Confirm date</button>
						<button on:click={cancelPaidDateMark} class="button">Cancel</button>
					</div>
				</div>
			{/if}
			{#if ui.payDate.showChangePaidDateButton}
				<button on:click={changePaidDateClicked} class="button">Change Date</button>
			{/if}
		{/if}
	</div>
{/if}

<style>
	.service-see {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 8px;
	}

	.label-and-value {
		display: flex;
		column-gap: 8px;
	}

	.mark-paid-window__footer {
		margin-top: 16px;
		display: flex;
		gap: 16px;
	}
</style>
