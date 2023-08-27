<script lang="ts">
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import { ItemHelper } from '@/lib/util/logic/item';
	import type { Item } from '@/lib/typings';

	export let data: Item;

	let currentItemRenderComponent: ComponentType = ItemHelper.getClassByTypeString(
		data.type
	)!.getListRender();
	const dispatch = createEventDispatcher();

	function clicked() {
		dispatch('click', data);
	}
</script>

<button on:click={clicked} class="square white-button">
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
