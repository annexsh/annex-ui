<script>
	import { setContext } from 'svelte';
	import { createConnectTransport } from "@connectrpc/connect-web";

	// Connect transport to be used throughout the app
	const transport = createConnectTransport({
		baseUrl: "http://localhost:50051",
	});

	setContext('transport', transport);
</script>

<slot />