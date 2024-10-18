<script lang="ts">
	import TestSuiteCard from '$lib/components/TestSuiteCard.svelte';
	import { TestSuite } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb.js';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import ItemsNotFoundMessage from '$lib/components/ItemsNotFoundMessage.svelte';

	export let data;

	const testSuites = data.testSuites;

</script>

<main class="p-4 bg-gray-50 dark:bg-gray-900">
	<Breadcrumb class="mb-5">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href={$page.url.pathname}>Test Suites</BreadcrumbItem>
	</Breadcrumb>

	<div class="mt-px space-y-4">
		{#if !testSuites.length}
			<ItemsNotFoundMessage title="No Test Suites found"
														message="Get started by registering a Test Suite Runner using one of the supported SDKs." />
		{:else }
			<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
				{#each testSuites as testSuite}
					<TestSuiteCard testSuite={new TestSuite(testSuite)} />
				{/each}
			</div>
		{/if}
	</div>
</main>

