<script lang="ts">
	import { onMount, type ComponentType } from 'svelte';
	import { ItemHelpText, ItemHelper, type iItemHelpText } from '@/lib/util/logic/item';
	import type { Item, ItemType } from '../../../typings';
	import AccountConfig from './renders/account-edit-render.svelte';

	export let data: Partial<Item>;

	// Component rendered based on the type of the item
	let currentComponent: ComponentType = AccountConfig;
	$: currentComponent = getEditRenderer(data.type!);

	let ui: { typeOptions: string[]; help: iItemHelpText };

	onMount(() => {
		ui = {
			typeOptions: ItemHelper.getItemClasses().map((ic) => ic.getTypeString()),
			help: ItemHelpText
		};
	});

	function typeSelectChanged(e: Event) {
		const value = (e.target as HTMLSelectElement).value as ItemType;
		currentComponent = getEditRenderer(value);
		data.type = value;
	}

	function getEditRenderer(type: string) {
		return ItemHelper.getClassByTypeString(type)!.getEditRender();
	}
</script>

{#if ui != null}
	<div class="form">
		{#if !data._id && data.type}
			<div class="help-string">{ui.help[data.type]}</div>
		{/if}
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
		<svelte:component this={currentComponent} config={data} />
	</div>
{/if}

<style>
	:global(.w-100) {
		width: 100%;
	}
	.help-string {
		padding-bottom: 16px;
	}
</style>
