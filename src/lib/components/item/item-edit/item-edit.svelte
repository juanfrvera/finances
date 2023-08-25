<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';
	import { ItemHelper } from '@/lib/util/logic/item';
	import type { IItemCreationData, ItemType } from '../../../typings';
	import AccountConfig from './renders/account-edit-render.svelte';

	export let data: IItemCreationData;

	let currentConfigComponent: ComponentType = AccountConfig;
	$: currentConfigComponent = getConfigRenderer(data.type);

	let ui: { typeOptions: string[] };

	onMount(() => {
		ui = {
			typeOptions: ItemHelper.getItemClasses().map((ic) => ic.getTypeString())
		};
	});

	function typeSelectChanged(e: Event) {
		const value = (e.target as HTMLSelectElement).value as ItemType;
		currentConfigComponent = getConfigRenderer(value);
		data.type = value;
	}

	function getConfigRenderer(type: string) {
		return ItemHelper.getClassByTypeString(type)!.getEditRender();
	}
</script>

{#if ui != null}
	<div class="form">
		<div class="label-and-input clickable-height">
			<label for="type-input">Type</label>
			<div class="select input-stretch">
				<select id="type-input" bind:value={data.type} on:change={typeSelectChanged} class="w-100">
					{#each ui.typeOptions as option (option)}
						<option>{option}</option>
					{/each}
				</select>
			</div>
		</div>
		<svelte:component this={currentConfigComponent} config={data.config} />
	</div>
{/if}

<style>
	:global(.label-and-input) {
		height: 40px;

		display: flex;
		align-items: center;
	}

	:global(.label-and-input > label) {
		min-width: 100px;
	}
	:global(.input-stretch) {
		flex-grow: 1;
		align-self: stretch;
	}
	:global(.w-100) {
		width: 100%;
	}

	.form {
		display: flex;
		flex-direction: column;
		row-gap: 8px;
	}
</style>
