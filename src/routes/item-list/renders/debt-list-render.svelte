<script lang="ts">
	import { onMount } from 'svelte';
	import type { IDebtConfig, IItemData } from '../../../typings';
	import NumberFormat from '../../util/number-format.svelte';

	export let data: IItemData<IDebtConfig>;

	let view: {
		containerClass: string;
		payDirectionString: string;
	};

	onMount(() => {
		const isPaid = data.config.paidDate != null;

		const containerClass = isPaid ? 'paid' : 'unpaid';

		const who = data.config.withWho;
		let payDirectionString = `${who} will pay you`;
		const theyPayMe = data.config.theyPayMe;
		if (theyPayMe && isPaid) payDirectionString = `${who} paid you`;
		if (!theyPayMe && isPaid) payDirectionString = `You paid ${who}`;
		if (!theyPayMe && !isPaid) payDirectionString = `You owe ${who}`;

		view = { containerClass, payDirectionString };
	});
</script>

{#if view != null}
	<div class={view.containerClass}>
		<div>{view.payDirectionString}</div>
		<div class="data"><NumberFormat value={data.config.amount} /> {data.config.currency}</div>
	</div>
{/if}
