<script lang="ts">
	import { page } from '$app/stores';
	import { testRoute } from '$lib/routes';

	export let data;

	const params = $page.params;
	const context = params.context;
	const group = params.group;
	const tests = data.tests;
</script>

<h1>Current Group: {group}</h1>

<h1>Tests:</h1>

<ul>
	{#each tests as test}
		<li><a href={testRoute(context, group, test.id)}>{test.name}</a></li>
	{/each}
</ul>