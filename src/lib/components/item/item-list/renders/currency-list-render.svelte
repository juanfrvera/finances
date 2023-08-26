<script lang="ts">
	import type { ICurrency } from '@/lib/typings';
	import NumberFormat from '@/lib/components/number-format.svelte';

	export let data: ICurrency;
</script>

<div>{data.currency}</div>
<div><NumberFormat value={data.total} /> {data.currency}</div>
