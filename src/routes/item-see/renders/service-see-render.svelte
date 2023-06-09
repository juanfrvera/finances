<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { ServiceItem } from '../../../logic/item';
	import type { IItemData, IServiceConfig } from '../../../typings';

	export let data: IItemData<IServiceConfig>;
	const dispatch = createEventDispatcher();

	let view: IView;
	onMount(() => {
		view = {};
		if (data.config.isManual) {
			let lastPayDateString = 'Never';
			let showMarkAsPaidButton = true;
			if (data.config.lastPayDateString != null) {
				const lastPayDate = new Date(data.config.lastPayDateString);
				showMarkAsPaidButton = data.config.isManual && !ServiceItem.wasThisMonthPaid(data);
				lastPayDateString = data.config.lastPayDateString;
			}

			view.payDate = {
				lastPayDateString,
				showMarkAsPaidButton,
				showChangePaidDateButton: !showMarkAsPaidButton
			};
		}
	});

	function markAsPaidClicked() {
		view.payDate!.showMarkAsPaidButton = false;
		openMarkPaidDatePicker(new Date(Date.now()));
	}
	function changePaidDateClicked() {
		view.payDate!.showChangePaidDateButton = false;
		openMarkPaidDatePicker(new Date(data.config.lastPayDateString));
	}
	function confirmPaidDate() {
		const date = new Date(view.payDate!.markPaidDatePicker!.dateInputString + 'T00:00');
		data.config.lastPayDateString = date.toLocaleDateString();
		view.payDate!.lastPayDateString = data.config.lastPayDateString;

		view.payDate!.markPaidDatePicker = undefined;
		view.payDate!.showChangePaidDateButton = true;
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

{#if view != null}
	<div class="service-see">
		<div>{data.config.name}</div>
		<div>{data.config.cost} {data.config.currency}</div>
		{#if view.payDate != undefined}
			<div class="label-and-value">
				<div class="value-label">Last pay date:</div>
				<div class="value">{view.payDate.lastPayDateString}</div>
			</div>
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
</style>
