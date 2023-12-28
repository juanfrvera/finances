<script lang="ts">
	import type { ComponentType } from 'svelte';
	import { ItemHelper } from '@/lib/util/logic/item';
	import type { ItemT } from '../../../typings';

	export let data: ItemT;

	let currentConfigComponent: ComponentType = ItemHelper.getClassByTypeString(
		data.type
	)!.getSeeRender();
</script>

<svelte:component this={currentConfigComponent} {data} />
