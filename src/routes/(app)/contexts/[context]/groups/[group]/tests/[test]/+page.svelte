<script lang="ts">
	import { page } from '$app/stores';
	import { testExecutionRoute } from '$lib/routes';

	export let data;
	// export let form;

	// export let test; TODO (also check if nil and retrieve if so)

	const params = $page.params;
	const context = params.context;
	const group = params.group;
	const testId = params.test;
	const executions = data.testExecutions;

</script>

<h1>Test Executions:</h1>

<form method="POST" action="?/executeTest">
	<button>New Execution</button>
</form>


<ul>
	{#each executions as exec}
		<li><a href={testExecutionRoute(context, group, testId, exec.id)}>{exec.id}</a></li>
	{/each}
</ul>