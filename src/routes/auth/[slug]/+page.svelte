<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { AuthService } from '@/lib/services/auth.service';

	export let data: PageData;

	const ui: {
		login?: { error?: string };
		registering?: { name?: string };
		username?: string;
		password?: string;
	} = {};

	onMount(() => {
		if (data.startWith === 'creation') {
			ui.registering = {};
		}
	});

	function logInInstead() {
		ui.registering = undefined;
		ui.login = {};
	}
	async function logIn() {
		if (!ui.username || !ui.password || !ui.login) {
			return;
		}

		ui.login.error = undefined;

		try {
			await AuthService.logIn({ username: ui.username, password: ui.password });
		} catch (error) {
			if (error instanceof Error) {
				ui.login.error = error.message;
			}
		}
	}
</script>

<div id="main">
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

			<button class="button is-primary is-fullwidth">Register</button>
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
			<button on:click={logIn} class="button is-link is-fullwidth">Log in</button>
			{#if ui.login.error}
				<div class="error">{ui.login.error}</div>
			{/if}
		</div>
		<div class="alternative">
			<p>You don't have an account?</p>
			<button on:click={logInInstead} class="button is-success">Register</button>
		</div>
	{/if}
</div>

<style>
	#main {
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
		font-size: 20px;
	}
	.auth-form {
		width: 100%;
	}
	.alternative {
		margin-top: 32px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.error {
		color: #a00;
	}
</style>
