<script lang="ts">
	import type { IItem, IItemCreationData, IItemData } from '../typings';
	import CreationModal from './creation-modal.svelte';
	import Item from './item-render/item.svelte';

	const view: {
		showCreationModal?: boolean;
		list: Array<IItemData<IItem>>;
	} = { list: [] };

	function addClicked() {
		view.showCreationModal = true;
	}
	function saveClickedOnCreationModal(event: CustomEvent<IItemCreationData<any>>) {
		console.log(event.detail);
		const newItem: IItemData<IItem> = {
			id: Date.now().toString(),
			type: event.detail.type,
			config: { ...event.detail.config }
		};
		view.list = [newItem, ...view.list];
	}
	function cancelClickedOnCreationModal() {
		view.showCreationModal = false;
	}
</script>

<div class="whiteboard">
	<button on:click={addClicked} class="square clickable">
		<div class="title">Add</div>
	</button>
	{#each view.list as item (item.id)}
		<Item data={item} />
	{/each}
</div>
{#if view.showCreationModal}
	<CreationModal on:save={saveClickedOnCreationModal} on:cancel={cancelClickedOnCreationModal} />
{/if}

<style>
	.whiteboard {
		display: flex;
	}
	.square {
		border: 1px solid;
		padding: 8px;
		font-size: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.clickable {
		cursor: pointer;
	}
</style>
