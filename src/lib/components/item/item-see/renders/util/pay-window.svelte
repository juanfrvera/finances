<script lang="ts">
	import type { IPayment } from '@/lib/typings';
	import { onMount } from 'svelte';

	export let edited: IPayment;
	export let onDeleteClicked: () => any;

	let ui: { payment: IPayment };

	onMount(() => {
		if (edited) {
			ui.payment = { ...edited };
		} else {
			ui.payment = {dateString};
		}
	});

	function deleteClicked() {
		onDeleteClicked();
	}
</script>

<div class="pay-window">
	{#if editing}
		<div class="pay-window__editing-header">
			<div class="pay-window__editing-title">Editing Payment</div>
			<button on:click={deleteClicked} class="button">Delete</button>
		</div>
	{/if}
	<input bind:value={ui.payWindow.dateInputString} type="date" class="input" placeholder="Date" />
	<input bind:value={ui.payWindow.amount} class="input" type="number" placeholder="Amount" />
	<input bind:value={ui.payWindow.note} class="input" type="text" placeholder="Note" />
	<div class="pay-window__footer">
		<button on:click={confirmPay} class="button {ui.payWindow.saving ? 'is-loading' : ''}"
			>Confirm</button
		>
		<button on:click={cancelPay} disabled={ui.payWindow.saving} class="button is-danger"
			>Cancel</button
		>
	</div>
</div>
