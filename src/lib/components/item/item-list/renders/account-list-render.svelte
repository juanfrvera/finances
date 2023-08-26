<script lang="ts">
	import type { IAccountConfig, iItem } from '../../../../typings';
	import NumberFormat from '@/lib/components/number-format.svelte';

	export let data: IAccount;
</script>

<div class="name">{data.config.name}</div>
<div class="data"><NumberFormat value={data.config.balance} /> {data.config.currency}</div>
