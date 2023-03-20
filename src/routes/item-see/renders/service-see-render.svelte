<script lang="ts">
	import { onMount } from 'svelte';
	import type { IItemData, IServiceItemConfig } from '../../../typings';

	export let data: IItemData<IServiceItemConfig>;

	let view: IView;
	onMount(() => {
		view = {};
		if (data.config.isManual) {
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
		openMarkPaidDatePicker(data.config.lastPayDate);
	}
	function confirmPaidDate() {
		const date = new Date(view.payDate!.markPaidDatePicker!.dateInputString + 'T00:00');
		view.payDate!.lastPayDateString = date.toLocaleDateString();
		data.config.lastPayDate = date;

		view.payDate!.markPaidDatePicker = undefined;
		view.payDate!.showChangePaidDateButton = true;
	}
	function openMarkPaidDatePicker(date: Date) {
		// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
		view.payDate!.markPaidDatePicker = {
			dateInputString: date.toISOString().substring(0, 10)
		};
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
