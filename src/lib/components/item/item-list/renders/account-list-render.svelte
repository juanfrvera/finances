<script lang="ts">
	import type { IAccount } from '@/lib/typings';
	import NumberFormat from '@/lib/components/number-format.svelte';

	export let data: IAccount;
</script>

<div class="name">{data.name}</div>
<div class="data"><NumberFormat value={data.balance} /> {data.currency}</div>
