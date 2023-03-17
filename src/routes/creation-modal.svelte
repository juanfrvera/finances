<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import AccountCreationConfig from './creation-configs/account-creation-config.svelte';
	import ServiceCreationConfig from './creation-configs/service-creation-config.svelte';

	export const data: { type: string; config } = {
		type: 'Account',
		config: {}
	};

	const dispatch = createEventDispatcher();
	let currentConfigComponent: typeof AccountCreationConfig | typeof ServiceCreationConfig =
		AccountCreationConfig;

	function typeSelectChanged(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		if (value === 'Account') {
			currentConfigComponent = AccountCreationConfig;
		} else if (value === 'Service') {
			currentConfigComponent = ServiceCreationConfig;
		}
		data.type = value;
	}
	function saveClicked() {
		dispatch('save', data);
	}
	function cancelClicked() {
		dispatch('cancel');
	}
</script>

<div class="modal">
	<div class="modal-content">
		<div class="modal-body">
			<div class="form">
				<div class="label-and-input clickable-height">
					<label for="type-input">Type</label>
					<select id="type-input" on:change={typeSelectChanged} class="input-stretch">
						<option>Account</option>
						<option>Service</option>
					</select>
				</div>
				<svelte:component this={currentConfigComponent} bind:config={data.config} />
			</div>
		</div>
		<div class="modal-footer">
			<button on:click={saveClicked} class="comfortable-button">Save</button>
			<button on:click={cancelClicked} class="comfortable-button">Cancel</button>
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
		background-color: white;
		padding: 16px;
		border: 1px solid;
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
