<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { CurrencyLogic, type ICurrencyContext } from '@/lib/util/logic/currency';

	export let value = 'ars';

	const context: ICurrencyContext = getContext(CurrencyLogic.contextKey);

	const ui: {
		list?: string[];
	} = {};

	onMount(async () => {
		ui.list = (await context.getCurrencies()).map((c) => c.config.currency);
	});

	function createButtonClicked() {
		context.onGoToCreation();
	}
</script>

<div class="label-and-input">
	<label for="currency-input">Currency</label>
	{#if ui.list}
		{#if ui.list.length}
			<div class="select input-stretch">
				<select bind:value id="currency-input" class="w-100">
					{#each ui.list as currency}
						<option>{currency}</option>
					{/each}
				</select>
			</div>
		{:else}
			<!-- Empty State -->
			<div class="create-currency-info">
				You don't have currencies <button on:click={createButtonClicked}>Create one</button>
			</div>
		{/if}
	{:else}
		<!-- Loading -->
		<div class="loading">Loading currencies...</div>
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
