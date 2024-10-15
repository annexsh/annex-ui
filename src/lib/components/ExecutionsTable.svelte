<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import { getExecutionStatus } from '$lib/models/execution';
	import { type PartialMessage, Timestamp } from '@bufbuild/protobuf';
	import More from '$lib/components/widgets/More.svelte';
	import { testExecutionRoute } from '$lib/routes';
	import ExecutionStatusBadge from '$lib/components/ExecutionStatusBadge.svelte';
	import { testExecutions } from '$lib/stores/test-executions';
	import { TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';

	export let context: string;
	export let testSuiteId: string;

	function dateFromPartialTS(ts: PartialMessage<Timestamp> | undefined): string {
		if (!ts) {
			return '';
		}
		return new Timestamp(ts).toDate().toISOString();
	}
</script>

<Table>
	<TableHead class="sticky top-0">
		{#each ['ID', 'Scheduled', 'Started', 'Finished', 'Status', ''] as title}
			<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each $testExecutions as execution}
			{@const status=getExecutionStatus(new TestExecution(execution))}
			<TableBodyRow class="text-base">
				<TableBodyCell class="p-4">{execution.id}</TableBodyCell>
				{#each [execution.scheduleTime, execution.startTime, execution.finishTime] as ts}
					<TableBodyCell class="px-4 font-normal text-gray-500 dark:text-gray-400">
						{dateFromPartialTS(ts)}
					</TableBodyCell>
				{/each}
				<TableBodyCell class="p-4 font-normal">
					<div class="flex items-center gap-2">
						<ExecutionStatusBadge status={status} />
					</div>
				</TableBodyCell>
				<TableBodyCell class="p-4">
					<More href={testExecutionRoute(context, testSuiteId, execution.testId, execution.id)} />
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>