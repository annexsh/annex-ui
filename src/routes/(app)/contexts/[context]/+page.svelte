<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { testSuitesRoute } from '$lib/routes';
	import { activeContext } from '$lib/stores/contexts';

	onMount(() => {
		const context = $page.params.context;
		activeContext.set(context);
		goto(testSuitesRoute(context));
	});
</script>
