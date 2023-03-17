<script lang="ts">
	import type { IAccountItem, IItemData } from '../../typings';

	export let data: IItemData<IAccountItem>;
</script>

<div class="name">{data.config.name}</div>
<div class="data">{data.config.balance} {data.config.currency}</div>
