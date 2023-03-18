<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { ItemHelper } from '../../logic/item';
	import type { IItemData } from '../../typings';

	export let data: IItemData;
	let currentConfigComponent: ComponentType = ItemHelper.getClassByTypeString(
		data.type
	)!.getSeeRender();
</script>

<svelte:component this={currentConfigComponent} {data} />
