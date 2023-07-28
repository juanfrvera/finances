<script lang="ts">
	import { createEventDispatcher, type ComponentType } from 'svelte';

	const dispatch = createEventDispatcher();

	function handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			dispatch('escapeKeyUp');
		} else if (event.key === 'Enter') {
			dispatch('enterKeyUp');
		}
	}
	function backgroundClicked() {
		dispatch('backgroundClick');
	}
</script>

<svelte:window on:keyup={handleKeyUp} />
<div class="modal">
	<button class="modal-background" on:click={backgroundClicked} />
	<div class="modal-content">
		<div class="modal-body"><slot /></div>
		<div class="modal-footer"><slot name="footer" /></div>
	</div>
</div>

<style>
	.modal {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal-content {
		position: relative;
		background-color: white;
		padding: 16px;
		border: 1px solid;
	}
	.modal-background {
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.75);
	}
	.modal-body {
		margin-top: 8px;
		margin-bottom: 16px;
	}
	.modal-footer {
		display: flex;
	}
</style>
