<script lang="ts">
	import TestCard from '$lib/components/TestCard.svelte';
	import { Test } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb.js';
	import { page } from '$app/stores';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { groupsRoute } from '$lib/routes';

	export let data;

	const context = $page.params.context;
	const groupName = $page.params.group;
	const tests = data.tests;
</script>

<main class="p-4 bg-gray-50 dark:bg-gray-900">
	<Breadcrumb class="mb-5">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href={groupsRoute(context)}>Test Suites</BreadcrumbItem>
		<BreadcrumbItem href={$page.url.pathname}>{groupName}</BreadcrumbItem>
	</Breadcrumb>

	<div class="mt-px space-y-4">
		<div class="grid grid-cols-1 gap-4 xl:grid-cols-4">
			{#each tests as test}
				<TestCard test="{new Test(test)}" />
			{/each}
		</div>
	</div>
</main>

