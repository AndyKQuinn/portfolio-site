<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import '@slidy/svelte/dist/slidy.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
</svelte:head>

<!-- Parallax Star Background -->
<div id="stars"></div>
<div id="stars2"></div>
<div id="stars3"></div>

<div class="app">
	<main>
		{@render children()}
	</main>

	<Header />

	<!-- <footer>
		<p>Copyright {new Date().getFullYear()} Andy K Quinn</p>
	</footer> -->
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}

</style>
