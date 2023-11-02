<script lang="ts">
	import type { IAccount } from '@/lib/typings';
	import type { ITab } from '@/lib/util/typings/tab.typings';
	import TransactionTable from './util/transaction-table.svelte';
	import type { IPayment, TransactionType } from '@/lib/util/typings/payment.typings';
	import { AccountService } from '@/lib/services/account.service';

	export let data: IAccount;

	const ui: {
		tabs: { readonly list: ITab<TabType>[]; show?: boolean; activeTab: TabType };
		transactions: { creator?: { t: IPayment; loading?: boolean } };
	} = {
		tabs: {
			list: [
				{ title: 'Account', active: true, type: 'main' },
				{ title: 'Transactions', type: 'transactions' }
			],
			activeTab: 'main'
		},
		transactions: {}
	};
	type TabType = 'main' | 'transactions';

	function tabClicked(tab: ITab<TabType>) {
		ui.tabs.list.forEach((t) => (t.active = false));
		tab.active = true;
		ui.tabs.activeTab = tab.type;
	}

	function newTransactionClicked() {
		const date = new Date(Date.now());
		const dateString = date.toISOString().substring(0, 10);
		ui.transactions.creator = { t: { transactionType: 'add', amount: 0, dateString } };
	}

	function transactionTypeSelectChanged(e: Event) {
		const value = (e.target as HTMLSelectElement).value as TransactionType;
	}

	async function confirmTransactionCreator() {
		const creator = ui.transactions.creator!;
		creator.loading = true;
		try {
			const result = await AccountService.addTransaction(data, creator.t);

			if (data.payments) data.payments = [result.createdPayment, ...data.payments];
			else data.payments = [result.createdPayment];

			data.balance = result.balance;

			ui.transactions.creator = undefined;
		} catch (error) {
			creator.loading = false;
		}
	}

	function cancelTransactionCreator() {
		cancelTransaction(ui.transactions.creator!.t);
		ui.transactions.creator = undefined;
	}

	function transactionRowClicked(row: IPayment) {}

	function confirmTransaction(transaction: IPayment) {}

	function cancelTransaction(transaction: IPayment) {}
</script>

{#if data != null}
	<div class="account-see">
		<div class="see-tabs tabs">
			<ul>
				{#each ui.tabs.list as tab}
					<li class={tab.active ? 'is-active' : ''}>
						<!-- svelte-ignore a11y-missing-attribute -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<a on:click={() => tabClicked(tab)}>{tab.title}</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="account-see__body">
			<!-- Main -->
			{#if ui.tabs.activeTab === 'main'}
				<div>{data.name}</div>
				<div>{data.balance} {data.currency}</div>
			{/if}

			<!-- Transactions -->
			{#if ui.tabs.activeTab === 'transactions'}
				<div class="account-see__transactions">
					{#if !ui.transactions.creator}
						<button on:click={newTransactionClicked} class="button">New Transaction</button>
					{:else}
						<div class="account-see__transaction-creator transaction-creator creator">
							<div class="form">
								<div class="label-and-input clickable-height">
									<label for="type-input">Type</label>
									<div class="select input-stretch">
										<select
											id="type-input"
											bind:value={ui.transactions.creator.t.transactionType}
											on:change={transactionTypeSelectChanged}
											class="w-100"
										>
											<option value="add">Add to this account</option>
											<option value="subtract">Subtract from this account</option>
										</select>
									</div>
								</div>

								<!-- Amount -->
								<div class="label-and-input">
									<label for="amount-input">Amount</label>
									<input
										bind:value={ui.transactions.creator.t.amount}
										type="number"
										class="input-stretch"
										id="amount-input"
									/>
								</div>

								<!-- Notes -->
								<div class="label-and-input">
									<label for="notes-input">Notes</label>
									<input
										bind:value={ui.transactions.creator.t.note}
										type="text"
										class="input-stretch"
										id="notes-input"
									/>
								</div>
							</div>
							<div class="transaction-creator__footer creator__footer">
								<button
									on:click={() => confirmTransactionCreator()}
									class="button {ui.transactions.creator.loading ? 'is-loading' : ''}"
									>Confirm</button
								>
								<button
									on:click={() => cancelTransactionCreator()}
									class="button is-danger {ui.transactions.creator.loading ? 'is-loading' : ''}"
									>Cancel</button
								>
							</div>
						</div>
					{/if}

					<TransactionTable rows={data.payments} onRowClicked={transactionRowClicked} />
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	.account-see {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 8px;
		padding-bottom: 32px;
	}

	.account-see__transactions {
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
</style>
