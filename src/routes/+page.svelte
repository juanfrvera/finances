<script lang="ts">
	import type { ICreationData } from '../typings';
	import CreationModal from './creation-modal.svelte';

	const view: {
		showCreationModal?: boolean;
	} = {};

	function addClicked() {
		view.showCreationModal = true;
	}
	function saveClickedOnCreationModal(event: CustomEvent<ICreationData>) {
		console.log(event.detail);
	}
	function cancelClickedOnCreationModal() {
		view.showCreationModal = false;
	}
</script>

<div class="whiteboard">
	<button on:click={addClicked} class="square clickable">
		<div class="title">Add</div>
	</button>
	<div class="square">
		<div class="title">Total Balance</div>
		<div class="data">7.800 ars</div>
		<div class="data">2.000 usd</div>
	</div>
	<div class="square">
		<div class="title">Next Manual Payment</div>
		<div class="data">Personal Internet</div>
	</div>
	<div class="square">
		<div class="title">Month recurrent costs</div>
		<div class="data">32.500 ars</div>
		<div class="data">15 usd</div>
	</div>
</div>
{#if view.showCreationModal}
	<CreationModal on:save={saveClickedOnCreationModal} on:cancel={cancelClickedOnCreationModal} />
{/if}

<style>
	.whiteboard {
		display: flex;
	}
	.square {
		border: 1px solid;
		padding: 8px;
		font-size: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.clickable {
		cursor: pointer;
	}
</style>
