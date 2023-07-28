<script lang="ts">
	import { onMount } from 'svelte';
	import { UserStore } from '../lib/util/storage/user.storage';
	import Items from '@/lib/components/item/items.svelte';
	import type { IStorage } from '@/lib/util/storage/typings';
	import type { IAccountConfig, IItemData, IServiceConfig } from '@/lib/components/item/typings';
	import AccountSeeRender from '@/lib/components/item/item-see/renders/account-see-render.svelte';
	import ServiceSeeRender from '@/lib/components/item/item-see/renders/service-see-render.svelte';

	const ui: {
		loadingItems?: boolean;
		newcomerWelcome?: {
			examples: {
				account: IItemData<IAccountConfig>;
				service: IItemData<IServiceConfig>;
			};
		};
		showItems?: boolean;
	} = {};
	let storage: IStorage<IItemData>;

	onMount(() => {
		const isSyncEnabled = UserStore.isSyncEnabled();
		if (isSyncEnabled) {
			ui.loadingItems = true;
		} else {
			const hasLocalData = UserStore.hasLocalData();
			if (hasLocalData) {
			} else {
				ui.newcomerWelcome = {
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
						}
					}
				};
			}
		}
	});
</script>

<div id="container">
	{#if ui.newcomerWelcome}
		<div>
			<p>Welcome, I can help you remember about your finances.</p>
			<p>Here are the things I can help you with:</p>
			<div>
				<div>
					<h3>Accounts</h3>
					<AccountSeeRender data={ui.newcomerWelcome.examples.account} />
					<p>You can have a list of all your accounts with their balance and currency</p>
				</div>
				<div>
					<h3>Services</h3>
					<ServiceSeeRender data={ui.newcomerWelcome.examples.service} />
					<p>
						You can store the services you need to pay every month, and see which ones you've
						already paid
					</p>
				</div>
			</div>
		</div>
	{/if}
	{#if ui.loadingItems}
		Welcome back, please wait while we load your items...
	{/if}
	{#if ui.showItems}
		<Items {storage} />
	{/if}
</div>

<style>
	:global(html) {
		height: 100%;
	}
	:global(body) {
		margin: 0;
		background-color: #dff1ec;
		min-height: 100%;
	}
	#container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
