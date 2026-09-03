<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head
	><title>Lofi ATC - Lofi beats with Real Air Traffic Control Communications</title></svelte:head
>
{@render children()}
