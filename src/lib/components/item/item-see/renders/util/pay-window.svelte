<script lang="ts">
	import type { IPayment } from '@/lib/util/typings/payment.typings';
	import { onMount } from 'svelte';

	export let defaultAmount = 0;
	export let editedPayment: IPayment | undefined;

	export let onConfirm: (payment: IPayment) => any;
	export let onCancel: (payment: IPayment) => any;
	export let onDelete: (payment: IPayment) => any;

	let ui: { payment: IPayment; loading?: boolean };

	onMount(() => {
		if (editedPayment) {
			ui = { payment: { ...editedPayment } };
		} else {
			const date = new Date(Date.now());

			// We use a 10 length string to cut the time from the date so it ends up being yyyy/mm/dd
			const dateString = date.toISOString().substring(0, 10);
			ui = { payment: { dateString, amount: defaultAmount } };
		}
	});

	function confirmClicked() {
		ui.loading = true;
		onConfirm(ui.payment);
	}

	function cancelClicked() {
		onCancel(ui.payment);
	}

	function deleteClicked() {
		onDelete(editedPayment!);
	}
</script>

{#if ui}
	<div class="pay-window">
		{#if editedPayment}
			<div class="pay-window__editing-header">
				<div class="pay-window__editing-title">Editing Payment</div>
				<button on:click={deleteClicked} class="button">Delete</button>
			</div>
		{/if}
		<input bind:value={ui.payment.dateString} type="date" class="input" placeholder="Date" />
		<input bind:value={ui.payment.amount} class="input" type="number" placeholder="Amount" />
		<input bind:value={ui.payment.note} class="input" type="text" placeholder="Note" />
		<div class="pay-window__footer">
			<button on:click={confirmClicked} class="button {ui.loading ? 'is-loading' : ''}"
				>Confirm</button
			>
			<button on:click={cancelClicked} disabled={ui.loading} class="button is-danger">Cancel</button
			>
		</div>
	</div>
{/if}

<style>
	.pay-window__editing-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 8px;
	}

	.pay-window__footer {
		margin-top: 8px;
		display: flex;
		justify-content: space-around;
	}
</style>
