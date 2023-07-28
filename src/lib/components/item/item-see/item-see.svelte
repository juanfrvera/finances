<script lang="ts">
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import { ItemHelper } from '@/lib/util/logic/item';
	import type { IItemData } from '../typings';

	export let data: IItemData;
	const dispatch = createEventDispatcher();

	let currentConfigComponent: ComponentType = ItemHelper.getClassByTypeString(
		data.type
	)!.getSeeRender();

	function passUpdate(event: CustomEvent<IItemData>) {
		dispatch('update', event.detail);
	}
</script>

<svelte:component this={currentConfigComponent} {data} on:update={passUpdate} />
