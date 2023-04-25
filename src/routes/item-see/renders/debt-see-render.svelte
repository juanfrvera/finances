<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { IDebtConfig, IItemData } from '../../../typings';

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
		payDirectionString?: string;
	} = {};

	onMount(() => {
		const isPaid = data.config.paidDate != null;
		view.payDate = {
			showPaidDate: isPaid,
			showMarkAsPaidButton: !isPaid,
			showChangePaidDateButton: isPaid
		};

		const who = data.config.withWho;
		let payDirectionString = `${who} will pay you`;
		const theyPayMe = data.config.theyPayMe;
		if (theyPayMe && isPaid) payDirectionString = `${who} paid you`;
		if (!theyPayMe && isPaid) payDirectionString = `You paid ${who}`;
		if (!theyPayMe && !isPaid) payDirectionString = `You need to pay ${who}`;

		view.payDirectionString = payDirectionString;
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
		<div>{view.payDirectionString}</div>
		<div>{data.config.amount} {data.config.currency}</div>
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