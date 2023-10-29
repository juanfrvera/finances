<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import {
		AccountItem,
		DebtItem,
		ItemHelper,
		ServiceItem,
		CurrencyItem
	} from '../../util/logic/item';
	import type { ICurrency, iItem, Item } from '../../typings';
	import ItemEdit from './item-edit/item-edit.svelte';
	import ItemList from './item-list/item-list.svelte';
	import ItemSee from './item-see/item-see.svelte';
	import Modal from '../modal.svelte';
	import { CurrencyLogic, type ICurrencyContext } from '../../util/logic/currency';
	import { deepCopy } from '@/lib/util/deep-copy';
	import { ItemService } from '@/lib/services/item.service';
	import { CurrencyService } from '@/lib/services/currency.service';
	import { ModalChannel } from '@/lib/services/modal-channel.service';

	let list: Item[] = [];
	let currentSearchQuery: string = '';

	const ui: {
		list?: Item[];
		creationModal?: { saving?: boolean; data: Partial<Item> };
		seeModal?: { item: Item; deleting?: boolean };
		editModal?: { item: Item; saving?: boolean };
	} = {};

	let afterCurrencyCreated: { creationModal?: { data: Partial<Item> } } | undefined;

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
		ItemService.getItems().then((data) => {
			list = data;
			calculateUiList();
		});
	}

	function calculateCurrencyItems() {
		const currencyItems = list.filter((i) => i.type === CurrencyItem.getTypeString());
		for (const currencyItem of currencyItems) {
			CurrencyItem.calculate(list, currencyItem as ICurrency);
		}
	}

	//#region Creation
	function addClicked() {
		ui.creationModal = {
			data: { type: AccountItem.getTypeString() }
		};
	}
	async function saveCreationModal() {
		if (!ui.creationModal) return;

		ui.creationModal.saving = true;
		try {
			let createdItem: Item;
			if (ui.creationModal.data.type != 'currency') {
				createdItem = await ItemService.create(ui.creationModal.data);
			} else {
				createdItem = await CurrencyService.create(ui.creationModal.data);
			}

			// Add new item at the top
			list = [createdItem, ...list];
			calculateUiList();
			calculateCurrencyItems();

			if (ui.creationModal.data.type !== CurrencyItem.getTypeString()) {
				closeCreationModal();
			} else {
				ui.creationModal.saving = false;
				currencyCreated();
			}
		} catch (error) {
			console.error(error);
			ui.creationModal.saving = false;
		}
	}
	function closeCreationModal() {
		ui.creationModal = undefined;
	}
	//#endregion Creation
	//#region See
	function itemClicked(event: CustomEvent<Item>) {
		ui.seeModal = { item: event.detail };
	}
	function closeSeeModal() {
		ui.seeModal = undefined;
	}
	function itemUpdated(event: CustomEvent<iItem>) {
		// Set update date of item so it is re-rendered
		event.detail.updateDate = new Date();
		calculateCurrencyItems();
	}
	//#endregion See
	//#region Edit
	function openEditModalFromSee() {
		ui.editModal = { item: ui.seeModal!.item };
	}
	async function saveEditModal() {
		if (!ui.editModal) return;

		ui.editModal.saving = true;
		try {
			const item = ui.editModal.item;
			const updatedItem = await ItemService.update(item._id, item);

			list = list.filter((i) => (i._id === updatedItem._id ? updatedItem : i));

			calculateUiList();
			calculateCurrencyItems();

			closeEditModal();

			ModalChannel.$channel.next({ type: 'itemEdited', data: { item } });
		} catch (error) {
			console.error(error);
			ui.editModal.saving = false;
		}
	}
	function closeEditModal() {
		calculateCurrencyItems();
		ui.editModal = undefined;
	}
	//#endregion Edit
	function searchInputChanged(e: Event) {
		currentSearchQuery = (e.target! as HTMLInputElement).value;
		calculateUiList();
	}
	function calculateUiList() {
		ui.list = list?.filter((i) => ItemHelper.isItemOnQuery(i, currentSearchQuery));
	}
	//#region fromEmptyState
	function createAccount() {
		ui.creationModal = { data: { type: AccountItem.getTypeString() } };
	}
	function createService() {
		ui.creationModal = { data: { type: ServiceItem.getTypeString() } };
	}
	function createDebt() {
		ui.creationModal = { data: { type: DebtItem.getTypeString() } };
	}
	function createCurrency() {
		ui.creationModal = { data: { type: CurrencyItem.getTypeString() } };
	}
	//#endregion
	async function deleteCurrentItem() {
		if (!ui.seeModal) return;

		ui.seeModal.deleting = true;
		const item = ui.seeModal.item;
		try {
			await ItemService.delete(item._id);
			list = list.filter((i) => i._id != item._id);

			calculateCurrencyItems();
			calculateUiList();

			closeSeeModal();
		} catch (error) {
			console.error(error);
		}
		if (ui.seeModal) ui.seeModal.deleting = false;
	}
	function switchToCurrencyCreation() {
		if (ui.creationModal == null) {
			ui.creationModal = { data: { type: CurrencyItem.getTypeString() } };
		} else {
			afterCurrencyCreated = { creationModal: deepCopy(ui.creationModal) };
			ui.creationModal.data = { type: CurrencyItem.getTypeString() };
		}
	}
	function currencyCreated() {
		if (
			afterCurrencyCreated != null &&
			ui.creationModal != null &&
			afterCurrencyCreated.creationModal != null
		) {
			const currencyData = ui.creationModal.data;
			const currency = currencyData.currency;

			ui.creationModal = afterCurrencyCreated.creationModal;
			ui.creationModal.data.currency = currency;

			afterCurrencyCreated = undefined;
		} else {
			closeCreationModal();
		}
	}
</script>

<svelte:head><title>Finances</title></svelte:head>

<div class="items">
	{#if ui.list}
		{#if ui.list.length || currentSearchQuery}
			<!-- Loaded list with items -->
			<header id="header">
				<div class="field">
					<p class="control has-icons-left">
						<input on:input={searchInputChanged} class="search-bar input" />
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
				{#each ui.list as item (item._id + item.type + item.updateDate)}
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
						Create a Service to keep track of something you need to pay every month. We will help
						you identify when was your last payment and the services you need to pay before the
						month ends.
					</div>
					<button on:click={createService} class="button">Create Service</button>
				</div>
				<div>
					<div class="title">Debt</div>
					<div class="description">
						Create a Debt to keep track of an amount someone owes you or that you owe to someone.
						You can mark it as paid when is time.
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
	{:else}
		<!-- Loading -->
		<div class="loading">Loading, please wait...</div>
	{/if}
</div>

<!-- Modals -->
{#if ui.creationModal}
	<Modal
		on:backgroundClick={closeCreationModal}
		on:escapeKeyUp={closeCreationModal}
		on:enterKeyUp={saveCreationModal}
	>
		<ItemEdit data={ui.creationModal.data} />
		<div slot="footer" class="modal-footer-buttons">
			<button
				on:click={saveCreationModal}
				class="button is-primary {ui.creationModal.saving ? 'is-loading' : ''}">Save</button
			>
			<button on:click={closeCreationModal} class="button">Cancel</button>
		</div>
	</Modal>
{/if}
{#if ui.seeModal}
	<Modal
		on:backgroundClick={closeSeeModal}
		on:escapeKeyUp={closeSeeModal}
		on:enterKeyUp={closeSeeModal}
	>
		<ItemSee data={ui.seeModal.item} on:update={itemUpdated} />
		<div slot="footer" class="modal-footer-buttons">
			<button on:click={openEditModalFromSee} class="button">Edit</button>
			<button
				on:click={deleteCurrentItem}
				class="button is-danger {ui.seeModal.deleting ? 'is-loading' : ''}">Delete</button
			>
			<button on:click={closeSeeModal} class="button">Close</button>
		</div>
	</Modal>
{/if}
{#if ui.editModal}
	<Modal on:backgroundClick={closeEditModal} on:escapeKeyUp={closeEditModal}>
		<ItemEdit bind:data={ui.editModal.item} />
		<div slot="footer" class="modal-footer-buttons">
			<button
				on:click={saveEditModal}
				class="button is-primary {ui.editModal.saving ? 'is-loading' : ''}">Save</button
			>
			<button on:click={closeEditModal} class="button">Cancel</button>
		</div>
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

	.items {
		margin: 8px;

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

	.loading {
		text-align: center;
	}
</style>
