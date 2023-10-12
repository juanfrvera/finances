<script lang="ts">
	import type { IAccount, ICurrency, IDebt, IService } from '@/lib/typings';

	import AccountSeeRender from '@/lib/components/item/item-see/renders/account-see-render.svelte';
	import ServiceSeeRender from '@/lib/components/item/item-see/renders/service-see-render.svelte';
	import DebtSeeRender from '@/lib/components/item/item-see/renders/debt-see-render.svelte';
	import CurrencySeeRender from '@/lib/components/item/item-see/renders/currency-see-render.svelte';
	import { goto } from '$app/navigation';

	const ui: {
		examples: {
			account: IAccount;
			service: IService;
			debt: IDebt;
			currency: ICurrency;
		};
	} = {
		examples: {
			account: {
				_id: 'account',
				type: 'account',
				name: 'Bank Account',
				balance: 5700,
				currency: 'usd'
			},
			service: {
				_id: 'service',
				type: 'service',
				name: 'Service',
				cost: 200,
				currency: 'usd',
				isManual: true
			},
			debt: {
				_id: 'debt',
				type: 'debt',
				withWho: 'Pedro',
				description: 'Pizzas',
				amount: 20,
				currency: 'usd',
				theyPayMe: false
			},
			currency: {
				_id: 'currency',
				type: 'currency',
				currency: 'usd',
				total: 8600
			}
		}
	};

	function startNowClicked() {
		goto('auth/create');
	}
</script>

<div class="welcome">
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
		<a on:click={startNowClicked}>
			<button class="call-to-action-button button is-primary">Start Now</button>
		</a>
	</div>
</div>

<style>
	.welcome {
		padding: 32px;
	}

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
