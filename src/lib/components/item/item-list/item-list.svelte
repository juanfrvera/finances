<script lang="ts">
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import { ItemHelper } from '@/lib/util/logic/item';
	import type { ItemT } from '@/lib/typings';

	export let data: ItemT;

	let currentItemRenderComponent: ComponentType = ItemHelper.getClassByTypeString(
		data.type
	)!.getListRender();

	const dispatch = createEventDispatcher();

	function clicked() {
		dispatch('click', data);
	}
	function dragStart() {
		dispatch('dragstart');
	}
	function drag(e) {
		dispatch('drag', e);
	}
	function dragEnd() {
		dispatch('dragend');
	}
</script>

<button
	on:click={clicked}
	draggable="true"
	on:dragstart={dragStart}
	on:drag={drag}
	on:dragend={dragEnd}
	class="square item-square white-button"
	data-itemid={data._id}
>
	<svelte:component this={currentItemRenderComponent} {data} />
</button>

<style>
	:global(.unpaid) {
		border: 1px solid red;
	}
	:global(.paid) {
		border: 1px solid green;
	}
</style>
