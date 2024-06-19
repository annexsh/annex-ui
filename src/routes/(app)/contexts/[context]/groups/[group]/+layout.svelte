<script lang="ts">
	import { page } from '$app/stores';
	import { groupRoute } from '$lib/routes';

	export let data;

	const context = $page.params.context;
	const groups = data.groups;
</script>

<nav>
	Groups:
	<ul>
	{#each groups as group}
		<li><a href={groupRoute(context, group.name)}>{group.name}</a></li>
	{/each}
	</ul>
</nav>

<slot></slot>

