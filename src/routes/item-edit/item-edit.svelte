<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';
	import { ItemHelper } from '../../logic/item';
	import type { IItemCreationData } from '../../typings';
	import AccountConfig from './renders/account-edit-render.svelte';

	export let data: IItemCreationData;

	let currentConfigComponent: ComponentType = AccountConfig;
	$: currentConfigComponent = getConfigRenderer(data.type);

	let view: { typeOptions: string[] };

	onMount(() => {
		view = {
			typeOptions: ItemHelper.getItemClasses().map((ic) => ic.getTypeString())
		};
	});

	function typeSelectChanged(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		currentConfigComponent = getConfigRenderer(value);
		data.type = value;
	}

	function getConfigRenderer(type: string) {
		return ItemHelper.getClassByTypeString(type)!.getEditRender();
	}
</script>

{#if view != null}
	<div class="form">
		<div class="label-and-input clickable-height">
			<label for="type-input">Type</label>
			<select
				id="type-input"
				bind:value={data.type}
				on:change={typeSelectChanged}
				class="input-stretch"
			>
				{#each view.typeOptions as option (option)}
					<option>{option}</option>
				{/each}
			</select>
		</div>
		<svelte:component this={currentConfigComponent} config={data.config} />
	</div>
{/if}

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

	.form {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}
</style>
