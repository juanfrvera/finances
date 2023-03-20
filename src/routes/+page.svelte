<script lang="ts">
	import { onMount } from 'svelte';
	import { AccountItem, TotalItem } from '../logic/item';
	import type { IItemConfig, IItemCreationData, IItemData, ITotalItemConfig } from '../typings';
	import ItemEdit from './item-edit/item-edit.svelte';
	import Item from './item-list/item.svelte';
	import ItemSee from './item-see/item-see.svelte';
	import { ItemStorage } from '../item.storage';
	import Modal from './util/modal.svelte';

	const view: {
		list: Array<IItemData>;
		creationModal?: { data: IItemCreationData };
		seeModal?: { item: IItemData };
		editModal?: { item: IItemData };
	} = { list: [] };
	const totalItem: IItemData<ITotalItemConfig> = {
		id: TotalItem.getTypeString(),
		type: TotalItem.getTypeString(),
		config: {
			currencies: [
				{ name: 'ars', total: 0 },
				{ name: 'usd', total: 0 }
			]
		}
	};

	onMount(() => {
		const list = ItemStorage.getItems();

		const totalIndex = list.findIndex((i) => i.type === TotalItem.getTypeString());
		if (totalIndex === -1) {
			list.push(totalItem);
		} else {
			list[totalIndex] = totalItem;
		}

		TotalItem.calculate(list, totalItem);

		view.list = list;
	});

	//#region Creation
	function addClicked() {
		view.creationModal = {
			data: AccountItem.getDefaultData()
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
		ItemStorage.saveItems(view.list);

		TotalItem.calculate(view.list, totalItem);

		closeCreationModal();
	}
	function closeCreationModal() {
		view.creationModal = undefined;
	}
	//#endregion Creation
	//#region See
	function itemClicked(event: CustomEvent<IItemData>) {
		view.seeModal = { item: event.detail };
	}
	function closeSeeModal() {
		view.seeModal = undefined;
	}
	//#endregion See
	//#region Edit
	function openEditModalFromSee() {
		view.editModal = { item: view.seeModal!.item };
	}
	function closeEditModal() {
		view.editModal = undefined;
	}
	//#endregion Edit
</script>

<div class="whiteboard">
	<button on:click={addClicked} class="square clickable">
		<div class="title">Add</div>
	</button>
	{#each view.list as item (item.id + item.type)}
		<Item data={item} on:click={itemClicked} />
	{/each}
</div>

<!-- Modals -->
{#if view.creationModal}
	<Modal
		on:backgroundClick={closeCreationModal}
		on:escapeKeyUp={closeCreationModal}
		on:enterKeyUp={saveCreationModal}
	>
		<ItemEdit data={view.creationModal.data} />
		<div slot="footer" class="modal-footer-buttons">
			<button on:click={saveCreationModal} class="comfortable-button">Save</button>
			<button on:click={closeCreationModal} class="comfortable-button">Cancel</button>
		</div>
	</Modal>
{/if}
{#if view.seeModal != null}
	<Modal
		on:backgroundClick={closeSeeModal}
		on:escapeKeyUp={closeSeeModal}
		on:enterKeyUp={closeSeeModal}
	>
		<ItemSee data={view.seeModal.item} />
		<div slot="footer" class="modal-footer-buttons">
			<button on:click={openEditModalFromSee} class="comfortable-button">Edit</button>
			<button on:click={closeSeeModal} class="comfortable-button">Close</button>
		</div>
	</Modal>
{/if}
{#if view.editModal != null}
	<Modal on:backgroundClick={closeEditModal} on:escapeKeyUp={closeEditModal}>
		<ItemEdit bind:data={view.editModal.item} />
	</Modal>
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
	.comfortable-button {
		padding: 4px 8px;
	}
	.modal-footer-buttons {
		width: 100%;
		display: flex;
		justify-content: space-around;
		column-gap: 32px;
	}
</style>
