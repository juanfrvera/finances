<script lang="ts">
	import type { IItemData, ICurrencyConfig } from '../../../../typings';
	import NumberFormat from '@/lib/components/number-format.svelte';

	export let data: IItemData<ICurrencyConfig>;
</script>

<div>{data.config.currency}</div>
<div><NumberFormat value={data.config.total} /> {data.config.currency}</div>
