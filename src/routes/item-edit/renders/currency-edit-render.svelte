<script lang="ts">
	import type { ICurrencyConfig } from '../../../typings';

	export let config: ICurrencyConfig;
</script>

<div class="label-and-input">
	<label for="abbreviation-input">Abbreviation</label>
	<input bind:value={config.currency} id="abbreviation-input" class="input-stretch" />
</div>

<div class="currency-info">
	The total will be calculated automatically with the sum of the account balances
</div>

<style>
	.currency-info {
		text-align: center;
	}
</style>
