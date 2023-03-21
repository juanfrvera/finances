<script lang="ts">
	import type { IAccountItemConfig, IItemData } from '../../typings';
	import NumberFormat from '../util/number-format.svelte';

	export let data: IItemData<IAccountItemConfig>;
</script>

<div class="name">{data.config.name}</div>
<div class="data"><NumberFormat value={data.config.balance} /> {data.config.currency}</div>
