<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head><title>Lofi ATC</title></svelte:head>
{@render children()}
