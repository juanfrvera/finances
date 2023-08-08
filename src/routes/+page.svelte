<script lang="ts">
	import { onMount } from 'svelte';
	import { UserStore } from '../lib/util/storage/user.storage';
	import Items from '@/lib/components/item/items.svelte';
	import type { IStorage } from '@/lib/util/storage/typings';
	import type { IItemData } from '@/lib/components/item/typings';
	import Welcome from '@/lib/components/welcome.svelte';

	const ui: {
		showNewcomerWelcome?: boolean;
		loadingItems?: boolean;
		showItems?: boolean;
		items?: IItemData[];
	} = {};
	let storage: IStorage<IItemData>;

	onMount(() => {
		const isSyncEnabled = UserStore.isSyncEnabled();
		if (isSyncEnabled) {
			ui.loadingItems = true;
		} else {
			const hasLocalData = UserStore.hasLocalData();
			if (hasLocalData) {
			} else {
				ui.showNewcomerWelcome = true;
			}
		}
	});
</script>

<div id="container">
	{#if ui.showNewcomerWelcome}
		<Welcome />
	{/if}
	{#if ui.loadingItems}
		Welcome back, please wait while we load your items...
	{/if}
	{#if ui.showItems}
		<Items {storage} />
	{/if}
</div>

<style>
	#container {
		max-width: 800px;
		margin: auto;
	}
</style>
