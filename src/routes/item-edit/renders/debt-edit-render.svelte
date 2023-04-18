<script lang="ts">
	import type { IDebtCreationConfig } from '../../../typings';
	import Switch from '../../util/switch.svelte';
	import CurrencySelect from '../util/currency-select.svelte';

	export let config: IDebtCreationConfig;
</script>

<div class="label-and-input">
	<label for="name-input">With who</label>
	<input bind:value={config.withWho} id="name-input" class="input-stretch" />
</div>
<CurrencySelect bind:value={config.currency} />
<div class="label-and-input">
	<label for="balance-input">Amount</label>
	<input bind:value={config.amount} id="balance-input" type="number" class="input-stretch" />
</div>
<div class="label-and-input">
	<label for="is-manual-input">They Pay Me</label>
	<div class="switch-container">
		<Switch bind:checked={config.theyPayMe} />
	</div>
</div>
