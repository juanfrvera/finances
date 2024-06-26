<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { AuthService } from '@/lib/services/auth.service';
	import { getUIErrorString } from '@/lib/util/error-handling';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	export let data: PageData;

	const ui: {
		login?: { error?: string };
		registering?: { name?: string; error?: string };
		username?: string;
		password?: string;
		sending?: boolean;
	} = {};

	onMount(() => {
		if (data.startWith === 'creation') {
			ui.registering = {};
		} else {
			ui.login = {};
		}
	});

	function logInInstead() {
		ui.registering = undefined;
		ui.login = {};
		ui.sending = false;
	}
	function registerInstead() {
		ui.login = undefined;
		ui.registering = {};
		ui.sending = false;
	}

	async function logIn() {
		if (!ui.username || !ui.password || !ui.login || ui.sending) return;

		ui.login.error = undefined;
		ui.sending = true;

		try {
			await AuthService.logIn({ username: ui.username, password: ui.password });
			goto(base);
		} catch (error) {
			ui.login.error = getUIErrorString(error);
		}

		ui.sending = false;
	}
	async function register() {
		if (!ui.username || !ui.password || !ui.registering || ui.sending) return;

		ui.registering.error = undefined;
		ui.sending = true;

		try {
			await AuthService.register({
				username: ui.username,
				password: ui.password,
				name: ui.registering.name
			});
			goto(base);
		} catch (error) {
			ui.registering.error = getUIErrorString(error);
		}

		ui.sending = false;
	}
</script>

<div class="auth">
	{#if ui.registering}
		<p class="main-info">Please fill the following fields to create your account:</p>
		<div class="auth-form">
			<!-- Name -->
			<div class="field">
				<label class="label">
					Name
					<div class="control">
						<input bind:value={ui.registering.name} class="input" type="text" />
					</div>
				</label>
			</div>

			<!-- Username -->
			<div class="field">
				<label class="label">
					Username
					<div class="control">
						<input bind:value={ui.username} class="input" type="username" />
					</div>
				</label>
			</div>

			<!-- Password -->
			<div class="field">
				<label class="label">
					Password
					<div class="control">
						<input bind:value={ui.password} class="input" type="password" />
					</div>
				</label>
			</div>

			<button
				on:click={register}
				class="button is-primary is-fullwidth {ui.sending ? 'is-loading' : ''}">Register</button
			>
		</div>
		<div class="alternative">
			<p>Do you have an account already?</p>
			<button on:click={logInInstead} class="button is-info">Log in</button>
		</div>
	{:else if ui.login}
		<p class="main-info">Please enter your credentials:</p>
		<div class="auth-form">
			<!-- Username -->
			<div class="field">
				<label class="label">
					Username
					<div class="control">
						<input bind:value={ui.username} class="input" type="username" />
					</div>
				</label>
			</div>

			<!-- Password -->
			<div class="field">
				<label class="label">
					Password
					<div class="control">
						<input bind:value={ui.password} class="input" type="password" />
					</div>
				</label>
			</div>
			<button on:click={logIn} class="button is-link is-fullwidth {ui.sending ? 'is-loading' : ''}"
				>Log in</button
			>
			{#if ui.login.error}
				<div class="error">{ui.login.error}</div>
			{/if}
		</div>
		<div class="alternative">
			<p class="alternative__question">Want to register instead?</p>
			<button on:click={registerInstead} class="button is-success">Register</button>
		</div>
	{/if}
</div>

<style lang="scss">
	.auth {
		width: 512px;
		margin-left: auto;
		margin-right: auto;
		margin-top: 64px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}
	.main-info {
		font-size: 24px;
	}
	.auth-form {
		width: 100%;
	}
	.alternative {
		margin-top: 32px;
		display: flex;
		flex-direction: column;
      gap: 8px;
		align-items: center;

      &__question{
         font-size: 20px;
      }
	}
	.error {
		color: #a00;
	}

	@media (max-width: 768px) {
		.auth {
			width: 100%;
			padding: 16px;
		}
	}
</style>
