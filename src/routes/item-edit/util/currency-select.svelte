<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { CurrencyLogic, type ICurrencyContext } from '../../../logic/currency.logic';

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
</script>

<div class="label-and-input">
	<label for="currency-input">Currency</label>
	<div class="select-and-button">
		{#if view.showList}
			<div class="select input-stretch">
				<select bind:value id="currency-input" class="w-100">
					<option>ars</option>
					<option>usd</option>
				</select>
			</div>
		{/if}
		{#if view.showCreateButton}
			<button on:click={createButtonClicked}>Create Currency</button>
		{/if}
		{#if view.creating}
			<input class="input" type="text" placeholder="usd" />
			<button disabled={view.creating.disableSave}>Save</button>
			<button>Cancel</button>
		{/if}
	</div>
</div>

<style>
	.select-and-button {
		display: flex;
	}
</style>
