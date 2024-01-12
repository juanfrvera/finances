<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import {
		AccountItem,
		DebtItem,
		ItemHelper,
		ServiceItem,
		CurrencyItem,
		ItemHelpText,
		type iItemHelpText
	} from '../../util/logic/item';
	import type { ICurrencyUI, iItem, ItemT } from '../../typings';
	import ItemEdit from './item-edit/item-edit.svelte';
	import ItemList from './item-list/item-list.svelte';
	import ItemSee from './item-see/item-see.svelte';
	import Modal from '../modal.svelte';
	import { CurrencyLogic, type ICurrencyContext } from '../../util/logic/currency';
	import { deepCopy } from '@/lib/util/deep-copy';
	import { ItemService } from '@/lib/services/item.service';
	import { CurrencyService } from '@/lib/services/currency.service';
	import { ItemChannel } from '@/lib/services/channel.service';

	const squareItemRowHeight = 80;

	let list: ItemT[] = [];
	let currentSearchQuery: string = '';

	const ui: {
		list?: ItemT[];
		creationModal?: { saving?: boolean; data: Partial<ItemT> };
		seeModal?: { item: ItemT; deleting?: boolean };
		editModal?: { item: ItemT; saving?: boolean };
		help: iItemHelpText;
	} = {
		help: ItemHelpText
	};

	let afterCurrencyCreated: { creationModal?: { data: Partial<ItemT> } } | undefined;

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
		ItemChannel.$channel.subscribe((signal) => {
			if (signal.type === 'itemEdited') itemWasUpdated(signal.data.item);
		});
	});

	function loadItems() {
		ItemService.getItems().then((data) => {
			list = data;
			list.forEach((item) => {
				if (item.sortOrder == undefined) item.sortOrder = 0;
			});
			calculateUiList();
		});
	}

	function calculateCurrencyItems(currency: string) {
		const currencyItems = list.filter(
			(i) => i.type === CurrencyItem.getTypeString() && i.currency === currency
		);
		for (const currencyItem of currencyItems) {
			CurrencyItem.calculate(list, currencyItem as ICurrencyUI);
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
			let createdItem: ItemT;
			if (ui.creationModal.data.type != 'currency') {
				createdItem = await ItemService.create(ui.creationModal.data);
			} else {
				createdItem = await CurrencyService.create(ui.creationModal.data);
			}

			// Add new item at the top
			list = [createdItem, ...list];
			calculateUiList();
			calculateCurrencyItems(createdItem.currency);
			ItemChannel.$channel.next({ type: 'itemEdited', data: { item: createdItem } });

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
	function itemClicked(event: CustomEvent<ItemT>) {
		ui.seeModal = { item: event.detail };
	}
	function closeSeeModal() {
		ui.seeModal = undefined;
	}
	function itemUpdated(event: CustomEvent<ItemT>) {
		const item = event.detail;
		reRenderUpdatedItem(item);
		if (item.type === 'account') calculateCurrencyItems(item.currency);
	}
	function reRenderUpdatedItem(item: iItem) {
		item.updateDate = new Date();
	}
	//#endregion See
	//#region Edit
	function openEditModalFromSee() {
		ui.editModal = { item: { ...ui.seeModal!.item } };
	}
	async function saveEditModal() {
		if (!ui.editModal) return;

		ui.editModal.saving = true;
		try {
			const item = ui.editModal.item;
			const serverItem = await ItemService.update(item._id, item);

			closeEditModal();

			ItemChannel.$channel.next({ type: 'itemEdited', data: { item: serverItem } });
			reRenderUpdatedItem(serverItem);
			if (ui.seeModal) ui.seeModal.item = serverItem;
		} catch (error) {
			console.error(error);
			ui.editModal.saving = false;
		}
	}
	function closeEditModal() {
		ui.editModal = undefined;
	}
	//#endregion Edit
	function searchInputChanged(e: Event) {
		currentSearchQuery = (e.target! as HTMLInputElement).value;
		calculateUiList();
	}
	function calculateUiList() {
		ui.list = list
			?.filter((i) => ItemHelper.isItemOnQuery(i, currentSearchQuery))
			.sort((a, b) => a.sortOrder - b.sortOrder);
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

			calculateCurrencyItems(item.currency);
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
	function itemWasUpdated(serverItem: ItemT) {
		const index = list.findIndex((i) => i._id === serverItem._id);
		list[index] = serverItem;

		calculateUiList();

		if (serverItem.type === 'account') calculateCurrencyItems(serverItem.currency);
	}

	interface ISquare {
		item: ItemT;
		offsetLeft: number;
		offsetTop: number;
		html: Element;
	}

	let dragData: {
		squares: Array<ISquare>;
		draggedItem: ItemT;
		originalSquare: ISquare;
		startingSortOders: Array<{ id: string; sortOrder: number }>;
		previousX: number;
	};

	function getItemSquares() {
		const htmlButtons = [...document.getElementsByClassName('item-square')] as HTMLButtonElement[];
		return htmlButtons.map((sq) => ({
			item: list.find((i) => i._id === sq.getAttribute('data-itemid'))!,
			offsetLeft: sq.offsetLeft,
			offsetTop: sq.offsetTop,
			html: sq
		}));
	}

	function dragStart(item: ItemT) {
		const squares = getItemSquares();
		const originalSquare = squares.find((sq) => sq.item._id === item._id)!;
		dragData = {
			draggedItem: item,
			squares,
			startingSortOders: list.map((i) => ({ id: i._id, sortOrder: i.sortOrder })),
			originalSquare,
			previousX: originalSquare.offsetLeft
		};
	}

	function isInSameRow(y: number, itemOffsetTop: number) {
		return y >= itemOffsetTop && y <= itemOffsetTop + squareItemRowHeight;
	}

	function swapSortOrders(itemA: ItemT, itemB: ItemT) {
		const temp = itemA.sortOrder;
		itemA.sortOrder = itemB.sortOrder;
		itemB.sortOrder = temp;
	}

	function isMoreToTheLeft(square: ISquare, x: number, y: number, originalSquareTop: number) {
		return (
			square.offsetTop < originalSquareTop ||
			(square.offsetTop == originalSquareTop && square.offsetLeft < x) ||
			// If the mouse y is in this row
			(y >= square.offsetTop &&
				y <= square.offsetTop + squareItemRowHeight &&
				square.offsetLeft < x)
		);
	}
	function isMoreToTheRight(square: ISquare, x: number, y: number, originalSquareTop: number) {
		return (
			square.offsetTop > originalSquareTop ||
			(square.offsetTop == originalSquareTop && square.offsetLeft > x) ||
			(y >= square.offsetTop &&
				y <= square.offsetTop + squareItemRowHeight &&
				square.offsetLeft > x)
		);
	}

	function drag(e: CustomEvent<DragEvent>) {
		// sort order of dragged item shouldn't be changed to prevent the dragging event from stopping
		const x = e.detail.clientX;
		const y = e.detail.clientY;

		// There is a last frame that sends clientX and clientY as 0
		if (x === 0 && y === 0) return;

		const direction = Math.sign(x - dragData.previousX);
		dragData.previousX = x;
		let orderChanged = false;

		// For now it just works limiting the checks according to the direction of the drag
		// TODO: do a mixed check to also check for drags that goes right but to an upper row, or left to a lower row
		// Moving item right
		if (direction > 0) {
			const greaterOrderSqs = dragData.squares.filter(
				(sq) => sq.item.sortOrder > dragData.draggedItem.sortOrder
			);

			if (!greaterOrderSqs || !greaterOrderSqs.length) return;

			// Only update one item at a time,
			const minGreaterSq = greaterOrderSqs.reduce((min, sq) => {
				if (min == undefined) return sq;

				if (sq.offsetTop > y) return min;

				// In the case the mouse is in another row, with this we discard some rows
				if (sq.offsetTop <= y && sq.offsetTop > min.offsetTop) return sq;

				if (sq.offsetLeft < min.offsetLeft) return sq;

				return min;
			});

			// If the min square has been passed
			if (isMoreToTheLeft(minGreaterSq, x, y, dragData.originalSquare.offsetTop)) {
				// This is a comment
				while (minGreaterSq.item.sortOrder >= dragData.draggedItem.sortOrder) {
					minGreaterSq.item.sortOrder -= 1;
				}
				orderChanged = true;

				// If there will end up being at least one square with the same sort order, reduce their sortOrder by 1
				let squares = dragData.squares.filter(
					(sq) => sq.item._id != dragData.draggedItem._id && sq.item._id != minGreaterSq.item._id
				);
				if (squares.find((sq) => sq.item.sortOrder === minGreaterSq.item.sortOrder)) {
					squares
						.filter((sq) => sq.item.sortOrder <= minGreaterSq.item.sortOrder)
						.forEach((sq) => (sq.item.sortOrder -= 1));
				}
			}
		} else if (direction < 0) {
			// Moving item left
			const lowerCoordSqs = dragData.squares.filter(
				(sq) => sq.item.sortOrder < dragData.draggedItem.sortOrder
			);

			if (!lowerCoordSqs || !lowerCoordSqs.length) return;

			// Only update one item at a time,
			const maxLowerSq = lowerCoordSqs.reduce((max, sq) => {
				if (max == undefined) return sq;

				if (sq.offsetTop > y) return max;

				if (sq.offsetTop <= y && sq.offsetTop > max.offsetTop) return sq;

				if (sq.offsetLeft > max.offsetLeft) return sq;

				return max;
			});

			// If the max square has been passed
			if (
				isMoreToTheRight(maxLowerSq, x, y, dragData.originalSquare.offsetTop) &&
				maxLowerSq.item.sortOrder < dragData.draggedItem.sortOrder
			) {
				while (maxLowerSq.item.sortOrder <= dragData.draggedItem.sortOrder) {
					maxLowerSq.item.sortOrder += 1;
				}
				orderChanged = true;

				// Remove dragged item and max from list
				let squares = dragData.squares.filter(
					(sq) => sq.item._id != dragData.draggedItem._id && sq.item._id != maxLowerSq.item._id
				);

				// If there will end up being at least one square with the same sort order, reduce their sortOrder by 1
				if (squares.find((sq) => sq.item.sortOrder === maxLowerSq.item.sortOrder)) {
					// Increase by one the sort order of every item at the right
					squares
						.filter((sq) => sq.item.sortOrder >= maxLowerSq.item.sortOrder)
						.forEach((sq) => (sq.item.sortOrder += 1));
				}
			}
		}

		if (orderChanged) {
			calculateUiList();

			// Recalculate square position after ui is updated
			setTimeout(() => {
				const squares = getItemSquares();
				dragData.squares = squares;
				dragData.originalSquare = squares.find((sq) => sq.item._id === dragData.draggedItem._id)!;
			});
		}
	}

	function dragEnd() {
		const changedSortOrders = list
			.map((item) => ({ id: item._id, sortOrder: item.sortOrder }))
			.filter(
				(newSO) =>
					newSO.sortOrder !=
					dragData.startingSortOders.find((sSO) => sSO.id === newSO.id)!.sortOrder
			);

		if (changedSortOrders && changedSortOrders.length) {
			ItemService.updateSortOrders(changedSortOrders);
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
				<button on:click={addClicked} data-itemid="add-button" class="square white-button">
					<div class="title">Add</div>
				</button>
				{#each ui.list as item (item.sortOrder + item._id + item.type + item.updateDate)}
					<ItemList
						data={item}
						on:click={itemClicked}
						on:dragstart={() => dragStart(item)}
						on:drag={(e) => drag(e)}
						on:dragend={() => dragEnd()}
					/>
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
					<div class="description">{ui.help.account}</div>
					<button on:click={createAccount} class="button">Create Account</button>
				</div>
				<div>
					<div class="title">Service</div>
					<div class="description">{ui.help.service}</div>
					<button on:click={createService} class="button">Create Service</button>
				</div>
				<div>
					<div class="title">Debt</div>
					<div class="description">{ui.help.debt}</div>
					<button on:click={createDebt} class="button">Create Debt</button>
				</div>
				<div>
					<div class="title">Currency</div>
					<div class="description">{ui.help.currency}</div>
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
