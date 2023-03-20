<script lang="ts">
	import type { IAccountItemConfig, IItemData } from '../../../typings';

	export let data: IItemData<IAccountItemConfig>;
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
