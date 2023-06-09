<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { AccountItem, DebtItem, ItemHelper, ServiceItem, CurrencyItem } from '../logic/item';
	import type {
		IItemConfig,
		IItemCreationData,
		IItemData,
		ICurrencyCreationConfig
	} from '../typings';
	import ItemEdit from './item-edit/item-edit.svelte';
	import ItemList from './item-list/item-list.svelte';
	import ItemSee from './item-see/item-see.svelte';
	import { ItemStorage } from '../storage/item';
	import Modal from '../components/modal.svelte';
	import { CurrencyLogic, type ICurrencyContext } from '../logic/currency';
	import { deepCopy } from '@/util/deep-copy';

	let list: IItemData[] = [];
	let currentSearchQuery: string = '';

	const view: {
		showEmptyState?: boolean;
		list: IItemData[];
		creationModal?: { data: IItemCreationData };
		seeModal?: { item: IItemData };
		editModal?: { item: IItemData };
	} = { list: [] };

	let afterCurrencyCreated: { creationModal?: { data: IItemCreationData } } | undefined;

	// Currency context
	const currencyContext: ICurrencyContext = {
		getCurrencies: CurrencyLogic.getCurrencies,
		onGoToCreation: switchToCurrencyCreation
	};
	setContext(CurrencyLogic.contextKey, currencyContext);

	onMount(() => {
		loadItems();
		CurrencyLogic.currencyAddedSubject.subscribe({
			next: (currency) => {
				console.log(`Currency added received in items, currency: ${currency}`);
			}
		});
	});

	function loadItems() {
		list = ItemStorage.getItems();
		calculateViewList();
	}

	function calculateCurrencyItems() {
		const currencyItems = list.filter((i) => i.type === CurrencyItem.getTypeString());

		for (const currencyItem of currencyItems) {
			CurrencyItem.calculate(list, currencyItem);
		}
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

		if (view.creationModal?.data.type !== CurrencyItem.getTypeString()) {
			closeCreationModal();
		} else {
			currencyCreated();
		}
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
		calculateCurrencyItems();
		ItemStorage.saveItems(list);
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
	function createCurrency() {
		view.creationModal = {
			data: { type: CurrencyItem.getTypeString(), config: {} }
		};
	}
	//#endregion
	function deleteCurrentItem() {
		const item = view.seeModal!.item;

		list = list.filter((i) => i.id != item.id);
		ItemStorage.deleteItem(item);

		calculateCurrencyItems();
		calculateViewList();

		closeSeeModal();
	}
	function switchToCurrencyCreation() {
		if (view.creationModal == null) {
			view.creationModal = { data: { type: CurrencyItem.getTypeString(), config: {} } };
		} else {
			afterCurrencyCreated = {
				creationModal: deepCopy(view.creationModal)
			};

			view.creationModal.data.type = CurrencyItem.getTypeString();
			view.creationModal.data.config = {};
		}
	}
	function currencyCreated() {
		if (
			afterCurrencyCreated != null &&
			view.creationModal != null &&
			afterCurrencyCreated.creationModal != null
		) {
			const currencyData: IItemCreationData<ICurrencyCreationConfig> = view.creationModal.data;
			const currency = currencyData.config.currency;

			view.creationModal = afterCurrencyCreated.creationModal;
			view.creationModal.data.config.currency = currency;

			afterCurrencyCreated = undefined;
		} else {
			closeCreationModal();
		}
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
		</main>
	{:else}
		<!-- Empty State -->
		<div id="empty-state">
			<div id="empty-state-welcome">
				Welcome, let's start creating your first Item, choose one of the following:
			</div>
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
					identify when was your last payment and the services you need to pay before the month
					ends.
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
			<div>
				<div class="title">Currency</div>
				<div class="description">
					Create a Currency to organize your accounts by linking them to it, then you will be able
					to see the sum of all the accounts in the same currency.
				</div>
				<button on:click={createCurrency} class="button">Create Currency</button>
			</div>
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
			<button on:click={saveCreationModal} class="button is-primary">Save</button>
			<button on:click={closeCreationModal} class="button">Cancel</button>
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
			<button on:click={deleteCurrentItem} class="button is-danger">Delete</button>
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
	.modal-footer-buttons {
		width: 100%;
		display: flex;
		justify-content: space-around;
		column-gap: 32px;
	}

	#empty-state {
		margin-top: 32px;
		display: flex;
		flex-direction: column;
		row-gap: 24px;
	}
	#empty-state-welcome {
		font-size: 20px;
	}
</style>
