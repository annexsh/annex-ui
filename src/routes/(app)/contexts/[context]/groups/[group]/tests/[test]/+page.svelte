<script lang="ts">
	import { page } from '$app/stores';
	import { groupRoute, groupsRoute } from '$lib/routes';
	import { TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';
	import {
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Card,
		Heading,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead, TableHeadCell,
		Toolbar
	} from 'flowbite-svelte';
	import ExecutionsTable from '$lib/components/ExecutionsTable.svelte';
	import NewExecutionModal from '$lib/components/NewExecutionModal.svelte';
	import { PlusOutline } from 'flowbite-svelte-icons';
	import type { Test } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb.js';

	export let data;

	const params = $page.params;
	const context = params.context;
	const group = params.group;
	const test = data.test as Test;
	const executions = data.testExecutions as TestExecution[];

	let open = false;
</script>

<main class="p-4 bg-gray-50 dark:bg-gray-900">
	<Breadcrumb class="mb-5">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href={groupsRoute(context)}>Test Suites</BreadcrumbItem>
		<BreadcrumbItem href={groupRoute(context, group)}>{group}</BreadcrumbItem>
		<BreadcrumbItem href={$page.url.pathname}>{test.name}</BreadcrumbItem>
	</Breadcrumb>

	<div>
		<div class="mb-6 items-center">
			<span class="text-3xl font-bold leading-none text-gray-900 dark:text-white sm:text-4xl">{test.name}</span>
		</div>

		<Card size="xl" class="shadow-sm max-w-none max-h-[calc(100vh-225px)] overflow-y-auto">
			<Heading tag="h2" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl w-full pb-2">
				Executions
			</Heading>

			<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
				<Input placeholder="Search for execution" class="me-4 w-80 border xl:w-96" />

				<div slot="end" class="flex items-center space-x-2">
					<Button on:click={() => {open = true}} size="md" class="gap-2 whitespace-nowrap px-3">
						<PlusOutline size="md" />
						New Execution
					</Button>
				</div>
			</Toolbar>

			<ExecutionsTable context={context} group={group} executions="{executions}" />
		</Card>
	</div>
</main>

<!-- Modals -->
<NewExecutionModal bind:open defaultInput={data.defaultInput} />
