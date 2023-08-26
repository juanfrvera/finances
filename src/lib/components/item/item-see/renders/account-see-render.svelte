<script lang="ts">
	import type { IAccountConfig, iItem } from '../../../../typings';

	export let data: IAccount;
</script>

{#if data != null}
	<div class="account-see">
		<div>{data.config.name}</div>
		<div>{data.config.balance} {data.config.currency}</div>
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
