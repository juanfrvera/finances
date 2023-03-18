<script lang="ts">
	import type { IItemConfig, IItemCreationData, IItemData } from '../typings';
	import { defaultData as accountCreationDefaultData } from './creation-configs/account-creation-config.svelte';
	import ItemModal from './item-modal.svelte';
	import Item from './item-render/item.svelte';

	const view: {
		creationModal?: {
			data: IItemCreationData;
		};
		list: Array<IItemData>;
		editModal?: {
			item: IItemData;
		};
	} = { list: [] };

	//#region Creation
	function addClicked() {
		view.creationModal = {
			data: {
				type: 'Account',
				config: accountCreationDefaultData
			}
		};
	}
	function saveCreationModal() {
		const data = view.creationModal!.data;

		const newItem: IItemData = {
			id: Date.now().toString(),
			type: data.type,
			config: { ...(data.config as IItemConfig) }
		};
		view.list = [newItem, ...view.list];

		closeCreationModal();
	}
	function closeCreationModal() {
		view.creationModal = undefined;
	}
	//#endregion Creation
	//#region Edition
	function itemClicked(event: CustomEvent<IItemData>) {
		view.editModal = { item: event.detail };
	}
	function closeEditModal() {
		view.editModal = undefined;
	}
	//#endregion
</script>

<div class="whiteboard">
	<button on:click={addClicked} class="square clickable">
		<div class="title">Add</div>
	</button>
	{#each view.list as item (item.id)}
		<Item data={item} on:click={itemClicked} />
	{/each}
</div>

<!-- Modals -->
{#if view.creationModal}
	<ItemModal
		data={view.creationModal.data}
		on:backgroundClick={closeCreationModal}
		on:escapeKeyUp={closeCreationModal}
		on:enterKeyUp={saveCreationModal}
	>
		<button on:click={saveCreationModal} class="comfortable-button">Save</button>
		<button on:click={closeCreationModal} class="comfortable-button">Cancel</button>
	</ItemModal>
{/if}
{#if view.editModal != null}
	<ItemModal
		bind:data={view.editModal.item}
		on:backgroundClick={closeEditModal}
		on:escapeKeyUp={closeEditModal}
	/>
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
