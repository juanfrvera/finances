<script lang="ts">
	import { onMount } from 'svelte';
	import type { IItemData, IServiceItemConfig } from '../../../typings';

	export let data: IItemData<IServiceItemConfig>;

	let view: {
		lastPayDateString: string;
		showMarkAsPaidButton: boolean;
		markPaidDatePicker?: {
			dateInputString: string;
		};
		showChangePaidDateButton: boolean;
	};

	onMount(() => {
		let lastPayDateString = 'Never';
		let showMarkAsPaidButton = true;
		if (data.config.lastPayDate != null) {
			const lastPayDate = data.config.lastPayDate;
			lastPayDateString = lastPayDate.toLocaleDateString();

			const date = new Date();
			if (
				lastPayDate.getMonth() === date.getMonth() &&
				lastPayDate.getFullYear() === date.getFullYear()
			) {
				showMarkAsPaidButton = false;
			}
		}

		view = {
			lastPayDateString,
			showMarkAsPaidButton,
			showChangePaidDateButton: !showMarkAsPaidButton
		};
	});

	function markAsPaidClicked() {
		view.showMarkAsPaidButton = false;
		openMarkPaidDatePicker(new Date(Date.now()));
	}
	function changePaidDateClicked() {
		view.showChangePaidDateButton = false;
		openMarkPaidDatePicker(data.config.lastPayDate);
	}
	function confirmPaidDate() {
		const date = new Date(view.markPaidDatePicker!.dateInputString + 'T00:00');
		view.lastPayDateString = date.toLocaleDateString();
		data.config.lastPayDate = date;

		view.markPaidDatePicker = undefined;
		view.showChangePaidDateButton = true;
	}
	function openMarkPaidDatePicker(date: Date) {
		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		view.markPaidDatePicker = {
			dateInputString: date.toISOString().substring(0, 10)
		};
	}
</script>

{#if view != null}
	<div class="service-see">
		<div>{data.config.name}</div>
		<div>{data.config.cost} {data.config.currency}</div>
		<div class="label-and-value">
			<div class="value-label">Last pay date:</div>
			<div class="value">{view.lastPayDateString}</div>
		</div>
		{#if view.showMarkAsPaidButton}
			<button on:click={markAsPaidClicked}>Mark as Paid</button>
		{/if}
		{#if view.markPaidDatePicker != undefined}
			<input bind:value={view.markPaidDatePicker.dateInputString} type="date" />
			<button on:click={confirmPaidDate}>Confirm date</button>
		{/if}
		{#if view.showChangePaidDateButton}
			<button on:click={changePaidDateClicked}>Change Date</button>
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
