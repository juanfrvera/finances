<script lang="ts">
	import { createEventDispatcher, type ComponentType } from 'svelte';
	import { ItemHelper } from '../logic/item';
	import type { IItemCreationData } from '../typings';
	import AccountConfig from './creation-configs/account-config.svelte';

	export let data: IItemCreationData;

	const dispatch = createEventDispatcher();
	let currentConfigComponent: ComponentType = AccountConfig;
	$: currentConfigComponent = getConfigRenderer(data.type);

	function typeSelectChanged(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		currentConfigComponent = getConfigRenderer(value);
		data.type = value;
	}

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

	function getConfigRenderer(type: string) {
		return ItemHelper.getClassByTypeString(type)!.getConfigRenderer();
	}
</script>

<svelte:window on:keyup={handleKeyUp} />
<div class="modal">
	<button class="modal-background" on:click={backgroundClicked} />
	<div class="modal-content">
		<div class="modal-body">
			<div class="form">
				<div class="label-and-input clickable-height">
					<label for="type-input">Type</label>
					<select
						id="type-input"
						bind:value={data.type}
						on:change={typeSelectChanged}
						class="input-stretch"
					>
						<option>Account</option>
						<option>Service</option>
					</select>
				</div>
				<svelte:component this={currentConfigComponent} config={data.config} />
			</div>
		</div>
		<div class="modal-footer">
			<slot />
		</div>
	</div>
</div>

<style>
	:global(.label-and-input) {
		height: 32px;

		display: flex;
		align-items: center;
	}

	:global(.label-and-input > label) {
		min-width: 72px;
	}
	:global(.input-stretch) {
		flex-grow: 1;
		align-self: stretch;
	}

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
	.form {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}

	.modal-footer {
		display: flex;
		justify-content: space-around;
	}
	.comfortable-button {
		padding: 4px 8px;
	}
</style>
