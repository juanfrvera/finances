<script lang="ts">
	import type { IServiceCreationConfig } from '@/lib/components/item/typings';
	import Switch from '@/lib/components/switch.svelte';
	import CurrencySelect from '../util/currency-select.svelte';

	export let config: IServiceCreationConfig;
</script>

<div class="label-and-input">
	<label for="name-input">Name</label>
	<input bind:value={config.name} id="name-input" class="input-stretch" />
</div>
<CurrencySelect bind:value={config.currency} />
<div class="label-and-input">
	<label for="cost-input">Cost</label>
	<input bind:value={config.cost} id="cost-input" type="number" class="input-stretch" />
</div>
<div class="label-and-input">
	<label for="is-manual-input">Is Manual</label>
	<div class="switch-container">
		<Switch bind:checked={config.isManual} />
	</div>
</div>
<div>
	Mark the service as manual if you want to mark it as paid every month. You can change this setting
	later.
</div>

<style>
	.switch-container {
		height: 16px;
	}
</style>
