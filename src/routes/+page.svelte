<script lang="ts">
	import { onMount } from 'svelte';
	import { UserStore } from '../storage/user.store';
	import Items from './items.svelte';

	const view: { showWelcome?: boolean; showItems?: boolean } = {};

	onMount(() => {
		const hasValidSession = UserStore.hasValidSession();
		view.showWelcome = !hasValidSession;
		view.showItems = hasValidSession;
	});

	function useAppOnlyInBrowserClicked() {
		view.showWelcome = false;
		view.showItems = true;
	}
</script>

<div id="main-container">
	{#if view.showWelcome}
		<div id="welcome-screen">
			Welcome, how do you want to use the app?
			<button on:click={useAppOnlyInBrowserClicked} class="important-button"
				>Use only in this browser</button
			>
			<button class="important-button">Register and use it from anywhere</button>
		</div>
	{/if}
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
	#welcome-screen {
		width: 600px;
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 16px;

		font-size: 24px;
	}
	.important-button {
		font-size: 18px;
		padding: 8px 16px;
	}
</style>
