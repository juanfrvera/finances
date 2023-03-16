<script lang="ts">
	export let value: string = 'ars';
</script>

<div class="label-and-input">
	<label for="currency-input">Currency</label>
	<select bind:value id="currency-input">
		<option>ars</option>
		<option>usd</option>
	</select>
</div>
