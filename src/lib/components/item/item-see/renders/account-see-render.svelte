<script lang="ts">
	import type { IAccountConfig, IItemData } from '../../typings';

	export let data: IItemData<IAccountConfig>;
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
