<script lang="ts">
	import type { IDebtCreationConfig } from '@/typings';
	import Switch from '@/components/switch.svelte';
	import CurrencySelect from '../util/currency-select.svelte';

	export let config: IDebtCreationConfig;
</script>

<div class="label-and-input">
	<label for="who-input">With who</label>
	<input bind:value={config.withWho} id="who-input" class="input-stretch" />
</div>
<div class="label-and-input">
	<label for="amount-input">Amount</label>
	<input bind:value={config.amount} id="amount-input" type="number" class="input-stretch" />
</div>
<CurrencySelect bind:value={config.currency} />
<div class="label-and-input">
	<label for="is-manual-input">They Pay Me</label>
	<div class="switch-container">
		<Switch bind:checked={config.theyPayMe} />
	</div>
</div>
<!-- Description -->
<div class="label-and-input">
	<label for="description-input">Description</label>
	<input bind:value={config.description} id="description-input" class="input-stretch" />
</div>
