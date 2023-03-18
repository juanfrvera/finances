<script lang="ts">
	import type { IAccountItemCreationConfig } from '../../../typings';
	import CurrencySelect from '../util/currency-select.svelte';

	export let config: IAccountItemCreationConfig;
</script>

<div class="label-and-input">
	<label for="name-input">Name</label>
	<input bind:value={config.name} id="name-input" class="input-stretch" />
</div>
<CurrencySelect bind:value={config.currency} />
<div class="label-and-input">
	<label for="balance-input">Balance</label>
	<input bind:value={config.balance} id="balance-input" type="number" class="input-stretch" />
</div>
