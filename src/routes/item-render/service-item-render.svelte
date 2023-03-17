<script lang="ts">
	import type { IServiceItem, IItemData } from '../../typings';

	export let data: IItemData<IServiceItem>;
</script>

<div class="name">{data.config.name}</div>
<div class="data">{data.config.cost} {data.config.currency}</div>
