<script lang="ts">
	import type { IAccountConfig, iItem } from '../../../../typings';

	export let data: IAccount;
</script>

{#if data != null}
	<div class="account-see">
		<div>{data.name}</div>
		<div>{data.balance} {data.currency}</div>
	</div>
{/if}

<style>
	.account-see {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 8px;
	}
</style>
