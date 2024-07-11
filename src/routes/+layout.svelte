<script>
	import { setContext } from 'svelte';
	import { newConnectTransport } from '$lib/clients';

	// Connect transport to be used throughout the app
	const transport = newConnectTransport();

	setContext('transport', transport);
</script>

<slot />