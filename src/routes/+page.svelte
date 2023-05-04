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
