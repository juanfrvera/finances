<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { CurrencyLogic, type ICurrencyContext } from '../../../logic/currency.logic';
	import { listen } from 'svelte/internal';

	export let value: string = 'ars';

	const context: ICurrencyContext = getContext(CurrencyLogic.contextKey);

	const view: {
		list?: string[];
		showList?: boolean;
		showCreateButton?: boolean;
		creating?: {
			disableSave?: boolean;
		};
	} = {};

	let createdCurrency: string;

	onMount(() => {
		view.list = context.getCurrencies();
		if (view.list.length > 0) {
			view.showList = true;
		}
		view.showCreateButton = true;
	});

	function createButtonClicked() {
		view.showCreateButton = false;
		view.showList = false;
		view.creating = {
			disableSave: true
		};
	}

	function creationInputKeyUp(e: KeyboardEvent) {
		const value = (e.target as HTMLInputElement).value;

		view.creating!.disableSave = value == null || value.length <= 0;

		createdCurrency = value;
	}

	function cancelCreation() {
		closeCreation();
	}

	function saveCreation() {
		context.addCurrency(createdCurrency);

		if (view.list != null) {
			view.list.push(createdCurrency);
		} else {
			view.list = [createdCurrency];
		}

		closeCreation();
	}

	function closeCreation() {
		createdCurrency = '';
		view.creating = undefined;
		view.showList = true;
		view.showCreateButton = true;
	}
</script>

<div class="label-and-input">
	<label for="currency-input">Currency</label>
	<div class="select-and-button">
		{#if view.showList && view.list}
			<div class="select input-stretch">
				<select bind:value id="currency-input" class="w-100">
					{#each view.list as currency}
						<option>{currency}</option>
					{/each}
				</select>
			</div>
		{/if}
		{#if view.showCreateButton}
			<button on:click={createButtonClicked}>Create Currency</button>
		{/if}
		{#if view.creating}
			<input on:keyup={creationInputKeyUp} class="input" type="text" placeholder="usd" />
			<button disabled={view.creating.disableSave} on:click={saveCreation}>Save</button>
			<button on:click={cancelCreation}>Cancel</button>
		{/if}
	</div>
</div>

<style>
	.select-and-button {
		display: flex;
	}
</style>
