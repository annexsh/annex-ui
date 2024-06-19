<script lang="ts">
	import { groupRoute } from '$lib/routes';

	export let data;
</script>

<h1>Groups</h1>

{#if data.groups}
	<ul>
		{#each data.groups as group}
			<li><a href={groupRoute(group.context, group.name)}>{group.name}</a></li>
		{/each}
	</ul>
{:else}
	<p> No groups found for this context. Please create one by spawning a test runner.</p>
{/if}