<script lang="ts">
	import { onMount } from 'svelte';
	import { UserStore } from '../storage/user.storage';
	import Items from './items.svelte';

	const view: { showWelcome?: boolean; showItems?: boolean } = {};

	onMount(() => {
		const hasValidSession = UserStore.hasValidSession();
		view.showItems = true;
	});
</script>

<div id="container">
	{#if view.showItems}
		<Items />
	{/if}
</div>

<style>
	:global(body) {
		margin: 0;
		background-color: #dff1ec;
	}
	#container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
