<script lang="ts">
	import { contexts } from '$lib/stores/contexts';

	export let data;

	contexts.set(data.contexts);
</script>

<!-- TODO: groups sidebar-->

<slot />