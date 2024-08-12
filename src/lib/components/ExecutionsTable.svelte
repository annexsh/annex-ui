<script lang="ts">
	import { Pagination, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
	import type { TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';
	import { getExecutionStatus } from '$lib/models/execution';
	import { type PartialMessage, Timestamp } from '@bufbuild/protobuf';
	import More from '$lib/components/widgets/More.svelte';
	import { testExecutionRoute } from '$lib/routes';
	import ExecutionStatusBadge from '$lib/components/ExecutionStatusBadge.svelte';

	export let context: string;
	export let group: string;
	export let executions: TestExecution[];

	let pages = [
		{ name: 1, href: '/components/pagination?page=1' },
		{ name: 2, href: '/components/pagination?page=2' },
		{ name: 3, href: '/components/pagination?page=3' },
		{ name: 4, href: '/components/pagination?page=4' },
		{ name: 5, href: '/components/pagination?page=5' }
	];

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
			{#each executions as execution}
				{@const status=getExecutionStatus(execution)}
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
						<More href={testExecutionRoute(context, group, execution.testId, execution.id)} />
					</TableBodyCell>
				</TableBodyRow>
			{/each}
	</TableBody>
</Table>