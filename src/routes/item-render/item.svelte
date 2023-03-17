<script lang="ts">
	import { ItemHelper } from '../../logic/item';
	import type { IItemData } from '../../typings';

	export let data: IItemData<any>;

	let currentItemRenderComponent = ItemHelper.getClassByTypeString(data.type)!.getRenderer();
</script>

<div class="square">
	<svelte:component this={currentItemRenderComponent} {data} />
</div>

<style>
	.square {
		border: 1px solid;
		padding: 8px;
		font-size: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
