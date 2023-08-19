<script lang="ts">
	import type {
		IAccountConfig,
		ICurrencyConfig,
		IDebtConfig,
		IItemData,
		IServiceConfig
	} from '@/lib/components/item/typings';

	import AccountSeeRender from '@/lib/components/item/item-see/renders/account-see-render.svelte';
	import ServiceSeeRender from '@/lib/components/item/item-see/renders/service-see-render.svelte';
	import DebtSeeRender from '@/lib/components/item/item-see/renders/debt-see-render.svelte';
	import CurrencySeeRender from '@/lib/components/item/item-see/renders/currency-see-render.svelte';

	const ui: {
		examples: {
			account: IItemData<IAccountConfig>;
			service: IItemData<IServiceConfig>;
			debt: IItemData<IDebtConfig>;
			currency: IItemData<ICurrencyConfig>;
		};
	} = {
		examples: {
			account: {
				id: 'account',
				type: 'account',
				config: {
					name: 'Bank Account',
					balance: 5700,
					currency: 'usd'
				}
			},
			service: {
				id: 'service',
				type: 'service',
				config: {
					name: 'Service',
					cost: 200,
					currency: 'usd',
					isManual: true,
					lastPayDateString: '2023/05/06'
				}
			},
			debt: {
				id: 'debt',
				type: 'debt',
				config: {
					withWho: 'Pedro',
					description: 'Pizzas',
					amount: 20,
					currency: 'usd',
					theyPayMe: false
				}
			},
			currency: {
				id: 'currency',
				type: 'currency',
				config: {
					currency: 'usd',
					total: 8600
				}
			}
		}
	};
</script>

<div>
	<div class="main-info-container">
		<p class="main-info">Welcome, I can help you remember about your finances.</p>
		<p class="main-info">Here are the things I can help you with:</p>
	</div>
	<div class="example-item-list">
		<div class="example-item">
			<h3 class="example-item-title">Accounts</h3>
			<div class="item-and-info">
				<div class="item-square">
					<AccountSeeRender data={ui.examples.account} />
				</div>
				<div class="example-item-info">
					You can have a list of all your accounts with their balance and currency
				</div>
			</div>
		</div>
		<div class="example-item">
			<h3 class="example-item-title">Services</h3>
			<div class="item-and-info">
				<div class="item-square">
					<ServiceSeeRender data={ui.examples.service} />
				</div>
				<div class="example-item-info">
					You can store the services you need to pay every month, and see which ones you've already
					paid
				</div>
			</div>
		</div>
		<div class="example-item">
			<h3 class="example-item-title">Debts</h3>
			<div class="item-and-info">
				<div class="item-square">
					<DebtSeeRender data={ui.examples.debt} />
				</div>
				<div class="example-item-info">
					I can remind you of debts you need to pay or if someone owes you
				</div>
			</div>
		</div>
		<div class="example-item">
			<h3 class="example-item-title">Currencies</h3>
			<div class="item-and-info">
				<div class="item-square">
					<CurrencySeeRender data={ui.examples.currency} />
				</div>
				<div class="example-item-info">
					You can create currencies and track the total sum of all the accounts in that currency.
				</div>
			</div>
		</div>
	</div>
	<div class="call-to-action">
		<div class="call-to-action-info">Ready?</div>
		<a href="/start">
			<button class="call-to-action-button button is-primary">Start Now</button>
		</a>
	</div>
</div>

<style>
	.main-info-container {
		padding: 16px 0;
	}

	.main-info {
		font-size: 18px;
	}

	.example-item-list {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.example-item-title {
		font-size: 20px;
	}
	.item-square {
		background-color: white;
		padding: 8px;
	}

	.item-and-info {
		display: flex;
		align-items: center;
		gap: 16px;
	}

	.call-to-action {
		padding: 32px 0;
		display: flex;
		gap: 16px;
		align-items: center;
		justify-content: center;
		font-size: 24px;
	}
</style>