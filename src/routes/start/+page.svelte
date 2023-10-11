<div class="start">
	<h1 id="main-info">Please choose how do you want to store your data:</h1>
	<div id="options">
		<div class="login-options__option login-options__text-container">
			<h2 class="option-title">Store data on my browser</h2>
			<p class="login-options__description">Your data will be accessible only from this browser.</p>
			<p class="login-options__description">
				You can always create an account and sync your data later.
			</p>
		</div>
		<a href="auth/create" class="login-options__option">
			<div class="login-options__text-container">
				<h2 class="option-title">Create an account or Login</h2>
				<p class="login-options__description">
					So you can have your data sync across all your devices.
				</p>
			</div>
		</a>
	</div>
</div>

<style>
	.start {
		padding: 0 16px;
		margin-top: 64px;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 32px;
	}
	#main-info {
		font-size: 20px;
	}
	#options {
		display: flex;
		gap: 32px;
	}
	.login-options__option {
		border: 1px solid black;
		padding: 32px;
		cursor: pointer;
		background-color: #eee;
		color: #444;
		width: 50%;
	}
	.login-options__option:hover {
		box-shadow: 1px 0px 14px 6px rgba(0, 0, 0, 0.43) inset;
		-webkit-box-shadow: 1px 0px 14px 6px rgba(0, 0, 0, 0.43) inset;
		-moz-box-shadow: 1px 0px 14px 6px rgba(0, 0, 0, 0.43) inset;
	}

	.login-options__text-container {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.option-title {
		font-size: 20px;
		font-weight: bold;
		text-align: center;
	}

	.login-options__description {
		text-align: justify;
	}

	@media (max-width: 768px) {
		#options {
			gap: 8px;
		}
	}
</style>
