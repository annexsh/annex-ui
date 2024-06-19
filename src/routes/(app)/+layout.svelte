<script lang="ts">
	import { contextRoute } from '$lib/routes';

	export let data;
</script>

<nav>
	{#if data.contexts.length}
		Contexts:
		<ul>
			{#each data.contexts as context}
				<li><a href={contextRoute(context)}>{context}</a></li>
			{/each}
		</ul>
	{/if}
</nav>

<slot></slot>

