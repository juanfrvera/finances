<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { CurrencyLogic, type ICurrencyContext } from '../../../logic/currency';

	export let value: string = 'ars';

	const context: ICurrencyContext = getContext(CurrencyLogic.contextKey);

	const view: {
		list?: string[];
		showList?: boolean;
		needsToCreate?: boolean;
	} = {};

	onMount(() => {
		view.list = context.getCurrencies().map((c) => c.config.currency);

		const hasCurrencies = view.list.length > 0;
		view.showList = hasCurrencies;
		view.needsToCreate = !hasCurrencies;
	});

	function createButtonClicked() {
		context.onGoToCreation();
	}
</script>

<div class="label-and-input">
	<label for="currency-input">Currency</label>
	{#if view.showList && view.list}
		<div class="select input-stretch">
			<select bind:value id="currency-input" class="w-100">
				{#each view.list as currency}
					<option>{currency}</option>
				{/each}
			</select>
		</div>
	{/if}
	{#if view.needsToCreate}
		<div class="create-currency-info">
			You don't have currencies <button on:click={createButtonClicked}>Create one</button>
		</div>
	{/if}
</div>

<style>
	.create-currency-info {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		column-gap: 8px;
	}
</style>
