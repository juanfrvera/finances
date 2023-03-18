<script lang="ts">
	import { onMount } from 'svelte';
	import type { IItemData, IServiceItemConfig } from '../../../typings';

	export let data: IItemData<IServiceItemConfig>;

	let view: {
		lastPayDateString: string;
	};

	onMount(() => {
		let lastPayDateString = 'Never';
		if (data.config.lastPayDate != null) {
			lastPayDateString = data.config.lastPayDate.toString();
		}

		view = { lastPayDateString };
	});
</script>

{#if view != null}
	<div class="service-see">
		<div>{data.config.name}</div>
		<div>{data.config.cost} {data.config.currency}</div>
		<div class="label-and-value">
			<div class="value-label">Last pay date:</div>
			<div class="value">{view.lastPayDateString}</div>
		</div>
		<button class="comfortable-button">Mark as Paid</button>
	</div>
{/if}

<style>
	.service-see {
		display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 8px;
	}

	.label-and-value {
		display: flex;
		column-gap: 8px;
	}
</style>
