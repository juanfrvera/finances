<script extends>
	import CurrencySelect from './util/currency-select.svelte';

	export const config = { name: '', cost: 0, currency: 'ars' };
</script>

<div class="label-and-input">
	<label for="name-input">Name</label>
	<input bind:value={config.name} id="name-input" />
</div>
<div class="label-and-input">
	<label for="cost-input">Cost</label>
	<input bind:value={config.cost} id="cost-input" type="number" />
</div>
<CurrencySelect bind:value={config.currency} />
