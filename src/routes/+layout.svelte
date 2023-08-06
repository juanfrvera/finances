<script>
	import '../app.scss';
</script>

<div id="container">
	<slot />
	<footer>Created by Juan Vera</footer>
</div>

<style>
	#container {
		background-color: #dff1ec;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	footer {
		width: 100%;
		background-color: #222;
		color: #e0c9c9;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
