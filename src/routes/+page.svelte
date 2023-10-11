<script lang="ts">
	import { onMount } from 'svelte';
	import { UserStore } from '../lib/util/storage/user.storage';
	import Items from '@/lib/components/item/items.svelte';
	import Welcome from '@/lib/components/welcome.svelte';
	import { AuthService } from '@/lib/services/auth.service';
	import { goto } from '$app/navigation';

	const ui: {
		showNewcomerWelcome?: boolean;
		showItems?: boolean;
	} = {};

	onMount(() => {
		if (UserStore.isSyncEnabled()) {
			if (AuthService.hasValidToken()) {
				ui.showItems = true;
			} else {
				goto('auth/login');
			}
		} else if (UserStore.hasLocalData()) {
		} else {
			ui.showNewcomerWelcome = true;
		}
	});
</script>

<div class="home">
	{#if ui.showNewcomerWelcome}
		<Welcome />
	{/if}
	{#if ui.showItems}
		<Items />
	{/if}
</div>

<style>
	.home {
		width: 80%;
		margin: auto;
	}

	@media (max-width: 800px) {
		.home {
			width: 100%;
		}
	}
</style>
