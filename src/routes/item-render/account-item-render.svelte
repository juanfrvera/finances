<script lang="ts">
	import type { IAccountItemConfig, IItemData } from '../../typings';

	export let data: IItemData<IAccountItemConfig>;
</script>

<div class="name">{data.config.name}</div>
<div class="data">{data.config.balance} {data.config.currency}</div>
