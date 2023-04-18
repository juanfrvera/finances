<script lang="ts">
	import type { IAccountConfig, IItemData } from '../../typings';
	import NumberFormat from '../util/number-format.svelte';

	export let data: IItemData<IAccountConfig>;
</script>

<div class="name">{data.config.name}</div>
<div class="data"><NumberFormat value={data.config.balance} /> {data.config.currency}</div>
