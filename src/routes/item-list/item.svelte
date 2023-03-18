<script lang="ts">
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import { ItemHelper } from '../../logic/item';
	import type { IItemData } from '../../typings';

	export let data: IItemData;

	let currentItemRenderComponent: ComponentType = ItemHelper.getClassByTypeString(
		data.type
	)!.getListRender();
	const dispatch = createEventDispatcher();

	function clicked() {
		dispatch('click', data);
	}
</script>

<button on:click={clicked} class="square">
	<svelte:component this={currentItemRenderComponent} {data} />
</button>

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
