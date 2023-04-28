<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { AccountItem, DebtItem, ItemHelper, ServiceItem, CurrencyItem } from '../logic/item';
	import type { IItemConfig, IItemCreationData, IItemData, ICurrencyConfig } from '../typings';
	import ItemEdit from './item-edit/item-edit.svelte';
	import ItemList from './item-list/item-list.svelte';
	import ItemSee from './item-see/item-see.svelte';
	import { ItemStore } from '../storage/item.storage';
	import Modal from './util/modal.svelte';
	import { CurrencyLogic } from '../logic/currency.logic';

	let list: IItemData[] = [];
	let currentSearchQuery: string = '';

	const view: {
		showEmptyState?: boolean;
		list: IItemData[];
		currencyList: IItemData<ICurrencyConfig>[];
		creationModal?: { data: IItemCreationData };
		seeModal?: { item: IItemData };
		editModal?: { item: IItemData };
	} = { list: [], currencyList: [] };

	// Currency context
	setContext(CurrencyLogic.contextKey, CurrencyLogic.currencyContext);

	onMount(() => {
		loadItems();
		CurrencyLogic.currencyAddedSubject.subscribe({
			next: (currency) => {
				console.log(`Currency added received in items, currency: ${currency}`);
			}
		});
	});

	function loadItems() {
		list = ItemStore.getItems();
		calculateViewList();
		calculateCurrencyItems();
	}

	function calculateCurrencyItems() {
		const currencyItems: Array<IItemData<ICurrencyConfig>> = [];
		const currencies = CurrencyLogic.currencyContext.getCurrencies();

		for (const currency of currencies) {
			const currencyItem: IItemData<ICurrencyConfig> = {
				id: currency,
				type: CurrencyItem.getTypeString(),
				config: {
					currency,
					total: 0
				}
			};
			CurrencyItem.calculate(list, currencyItem);

			currencyItems.push(currencyItem);
		}

		view.currencyList = currencyItems;
	}

	//#region Creation
	function addClicked() {
		view.creationModal = {
			data: { type: AccountItem.getTypeString(), config: {} }
		};
	}
	function saveCreationModal() {
		const data = view.creationModal!.data;

		const newItem: IItemData = {
			id: Date.now().toString(),
			type: data.type,
			config: { ...(data.config as IItemConfig) }
		};

		list = [newItem, ...list];
		calculateViewList();
		calculateAndSave();
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
	function itemUpdated(event: CustomEvent<IItemData>) {
		// Set update date of item so it is re-rendered
		event.detail.updateDate = new Date();
		calculateAndSave();
	}
	//#endregion See
	//#region Edit
	function openEditModalFromSee() {
		view.editModal = { item: view.seeModal!.item };
	}
	function closeEditModal() {
		calculateAndSave();
		view.editModal = undefined;
	}
	//#endregion Edit
	function calculateAndSave() {
		ItemStore.saveItems(list);
		calculateCurrencyItems();
	}
	function searchInputChanged(e: Event) {
		currentSearchQuery = (e.target! as HTMLInputElement).value;
		calculateViewList();
	}
	function calculateViewList() {
		if (list != null && list.length > 0) {
			view.list = list.filter((i) => ItemHelper.isItemOnQuery(i, currentSearchQuery));
			view.showEmptyState = false;
		} else {
			view.showEmptyState = true;
		}
	}
	//#region fromEmptyState
	function createAccount() {
		view.creationModal = {
			data: { type: AccountItem.getTypeString(), config: {} }
		};
	}
	function createService() {
		view.creationModal = {
			data: { type: ServiceItem.getTypeString(), config: {} }
		};
	}
	function createDebt() {
		view.creationModal = {
			data: { type: DebtItem.getTypeString(), config: {} }
		};
	}
	//#endregion
	function deleteCurrentItem() {
		const item = view.seeModal!.item;

		list = list.filter((i) => i.id != item.id);
		ItemStore.deleteItem(item);

		if (list.length > 1) {
			calculateCurrencyItems();
		} else if (list.length == 1 && list[0].type === CurrencyItem.getTypeString()) {
			ItemStore.deleteItem(list[0]);
			list = [];
		}

		calculateViewList();

		closeSeeModal();
	}
</script>

<svelte:head>
	<title>Finances</title>
</svelte:head>

<div id="container">
	{#if !view.showEmptyState}
		<header id="header">
			<div class="field">
				<p class="control has-icons-left">
					<input id="search-bar" on:input={searchInputChanged} class="input" />
					<span class="icon is-small is-left">
						<i class="fa-solid fa-magnifying-glass" />
					</span>
				</p>
			</div>
		</header>
		<main id="whiteboard">
			<button on:click={addClicked} class="square white-button">
				<div class="title">Add</div>
			</button>
			{#each view.list as item (item.id + item.type + item.updateDate)}
				<ItemList data={item} on:click={itemClicked} />
			{/each}
			{#each view.currencyList as currency (currency.id + currency.config.total)}
				<ItemList data={currency} on:click={itemClicked} />
			{/each}
		</main>
	{:else}
		<div>Welcome, let's start creating your first Item, choose one of the following:</div>
		<div>
			<div class="title">Account</div>
			<div class="description">
				Create an Account to keep track of the balance of an specific bank account or wallet you
				want to track.
			</div>
			<button on:click={createAccount} class="button">Create Account</button>
		</div>
		<div>
			<div class="title">Service</div>
			<div class="description">
				Create a Service to keep track of something you need to pay every month. We will help you
				identify when was your last payment and the services you need to pay before the month ends.
			</div>
			<button on:click={createService} class="button">Create Service</button>
		</div>
		<div>
			<div class="title">Debt</div>
			<div class="description">
				Create a Debt to keep track of an amount someone owes you or that you owe to someone. You
				can mark it as paid when is time.
			</div>
			<button on:click={createDebt} class="button">Create Debt</button>
		</div>
	{/if}
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
		<ItemSee data={view.seeModal.item} on:update={itemUpdated} />
		<div slot="footer" class="modal-footer-buttons">
			<button on:click={openEditModalFromSee} class="button">Edit</button>
			<button on:click={deleteCurrentItem} class="button">Delete</button>
			<button on:click={closeSeeModal} class="button">Close</button>
		</div>
	</Modal>
{/if}
{#if view.editModal != null}
	<Modal on:backgroundClick={closeEditModal} on:escapeKeyUp={closeEditModal}>
		<ItemEdit bind:data={view.editModal.item} />
	</Modal>
{/if}

<style>
	:global(.square) {
		padding: 8px;

		border: 1px solid;

		font-size: 20px;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	:global(.white-button) {
		background-color: white;
		cursor: pointer;
	}
	:global(.white-button:hover) {
		background-color: lightgray;
	}

	#container {
		margin: 16px;
		width: 100%;

		display: flex;
		flex-direction: column;
		row-gap: 16px;
	}
	#header,
	#whiteboard {
		width: 100%;
	}
	#whiteboard {
		display: flex;
		flex-wrap: wrap;
		column-gap: 8px;
		row-gap: 12px;
		justify-content: space-between;
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
