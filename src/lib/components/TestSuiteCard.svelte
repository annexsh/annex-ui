<script lang="ts">
	import {
		Card,
		Heading,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import More from '$lib/components/widgets/More.svelte';
	import { Timestamp } from '@bufbuild/protobuf';
	import type { TestSuite } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb.js';
	import { testSuiteRoute } from '$lib/routes';

	export let testSuite: TestSuite;

	let runners = testSuite.runners;
	let moreRunnersCount = 0;

	if (runners.length > 3) {
		moreRunnersCount = runners.length - 3;
		runners = runners.splice(3);
	}
</script>

<Card size="xl" class="shadow-sm max-w-none">
	<div class="items-center justify-between lg:flex">
		<div class="mb-4 mt-px lg:mb-0">
			<Heading tag="h3" class="-ml-0.25 mb-2 text-xl font-semibold dark:text-white">
				{testSuite.name}
			</Heading>
			<span class="text-base font-normal text-gray-500 dark:text-gray-400">
				Test Runners
			</span>
		</div>
		<div class="-mt-8">
			<More title="View" href={testSuiteRoute(testSuite.context, testSuite.id)} />
		</div>
	</div>
	<Table
		hoverable={false}
		noborder
		class="mt-6 min-w-full divide-y divide-gray-200 dark:divide-gray-600"
	>
		<TableHead class="bg-gray-50 dark:bg-gray-700">
			{#each ['ID', 'Last Accessed'] as header}
				<TableHeadCell class="whitespace-nowrap p-2 font-normal">{header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody>
			{#each testSuite.runners as runner}
				<TableBodyRow>
					<TableBodyCell class="px-2 font-normal text-gray-500 dark:text-gray-400">{runner.id.substring(0, 12)}</TableBodyCell>
					<TableBodyCell class="px-2 font-normal text-gray-500 dark:text-gray-400">
						{new Timestamp(runner.lastAccessTime).toDate().toISOString()}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
			{#if moreRunnersCount > 0}
				<tfoot>
				<tr>
					<TableBodyCell class="px-4 font-normal">+{moreRunnersCount} more</TableBodyCell>
				</tr>
				</tfoot>
			{/if}
		</TableBody>
	</Table>
</Card>
