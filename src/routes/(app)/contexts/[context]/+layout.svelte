<script lang="ts">
	import { page } from '$app/stores';
	import { activeContext } from '$lib/stores/contexts';

	const context = $page.params.context;
	activeContext.set(context);
</script>

<slot />
