<script lang="ts">
	import { contextRoute } from '$lib/routes';

	export let data;
</script>

<h1>Contexts</h1>

{#if data.contexts}
<ul>
	{#each data.contexts as context}
		<li><a href={contextRoute(context)}>{context}</a></li>
	{/each}
</ul>
{:else}
	<p> No contexts found, please create one.</p>
{/if}
