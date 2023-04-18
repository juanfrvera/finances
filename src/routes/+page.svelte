<script lang="ts">
	import { onMount } from 'svelte';
	import { UserStore } from '../storage/user.store';
	import Items from './items.svelte';

	const view: { showWelcome?: boolean; showItems?: boolean } = {};

	onMount(() => {
		const hasValidSession = UserStore.hasValidSession();
		view.showItems = true;
	});
</script>

<div id="main-container">
	{#if view.showItems}
		<Items />
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
	}
	#main-container {
		width: 100%;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
