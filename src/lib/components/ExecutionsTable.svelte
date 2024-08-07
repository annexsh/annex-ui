<script lang="ts">
	import {
		Badge,
		Indicator,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import type { TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';
	import { getExecutionStatus, ExecutionStatus } from '$lib/models/execution';
	import { type PartialMessage, Timestamp } from '@bufbuild/protobuf';
	import More from '$lib/components/widgets/More.svelte';
	import { testExecutionRoute } from '$lib/routes';

	export let context: string;
	export let group: string;
	export let executions: TestExecution[];

	const statusColors: { [key in ExecutionStatus]: 'dark' | 'red' | 'yellow' | 'green' | 'blue' } = {
		[ExecutionStatus.Unknown]: 'dark',
		[ExecutionStatus.Success]: 'green',
		[ExecutionStatus.Error]: 'red',
		[ExecutionStatus.Running]: 'blue',
		[ExecutionStatus.Scheduled]: 'yellow'
	};

	function dateFromPartialTS(ts: PartialMessage<Timestamp> | undefined): string {
		if (!ts) {
			return '';
		}
		return new Timestamp(ts).toDate().toISOString();
	}
</script>

<Table>
	<TableHead class="border-y border-gray-200 bg-gray-100 dark:border-gray-700">
		{#each ['ID', 'Scheduled', 'Started', 'Finished', 'Status', ''] as title}
			<TableHeadCell class="p-4 font-medium">{title}</TableHeadCell>
		{/each}
	</TableHead>
	<TableBody>
		{#each executions as execution}
			{@const status=getExecutionStatus(execution)}
			{@const color=statusColors[status]}
			<TableBodyRow class="text-base">
				<TableBodyCell class="p-4">{execution.id}</TableBodyCell>
				{#each [execution.scheduleTime, execution.startTime, execution.finishTime] as ts}
					<TableBodyCell class="px-4 font-normal text-gray-500 dark:text-gray-400">
						{dateFromPartialTS(ts)}
					</TableBodyCell>
				{/each}
				<TableBodyCell class="p-4 font-normal">
					<div class="flex items-center gap-2">
						<Indicator color={color} />
						<Badge color={color}>{status}</Badge>
					</div>
				</TableBodyCell>
				<TableBodyCell class="p-4">
					<More href={testExecutionRoute(context, group, execution.testId, execution.id)} />
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>