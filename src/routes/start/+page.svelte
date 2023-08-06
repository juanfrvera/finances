<div id="main">
	<h1 id="main-info">Please choose how do you want to store your data:</h1>
	<div id="options">
		<div class="option">
			<h2 class="option-title">Store data on my browser</h2>
			<p>Your data will be accessible only from this browser</p>
			<p>You can always create an account and sync your data later</p>
		</div>
		<a href="auth/create">
			<div class="option">
				<h2 class="option-title">Create an account</h2>
				<p>So you can have your data sync across all your devices</p>
			</div>
		</a>
	</div>
</div>

<style>
	#main {
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
	.option {
		border: 1px solid black;
		padding: 32px;
		cursor: pointer;
		background-color: #eee;
		color: #444;
	}
	.option:hover {
		box-shadow: 1px 0px 14px 6px rgba(0, 0, 0, 0.43) inset;
		-webkit-box-shadow: 1px 0px 14px 6px rgba(0, 0, 0, 0.43) inset;
		-moz-box-shadow: 1px 0px 14px 6px rgba(0, 0, 0, 0.43) inset;
	}
	.option-title {
		font-size: 20px;
		font-weight: bold;
	}
</style>
