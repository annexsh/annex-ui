<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { contextRoute, contextsRoute } from '$lib/routes';

	export let data;

	onMount(() => {
		const contexts = data.contexts;
		if (contexts.length === 0) {
			goto(contextsRoute)
		}
		const context = contexts.includes('default') ? 'default' : contexts[0];
		goto(contextRoute(context));
	});
</script>

<!--TODO: loading-->