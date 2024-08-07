<script lang="ts">
	import GroupCard from '$lib/components/GroupCard.svelte';
	import { Group } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb.js';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { page } from '$app/stores';

	export let data;

	const groups = data.groups;

</script>

<main class="p-4 bg-gray-50 dark:bg-gray-900">
	<Breadcrumb class="mb-5">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href={$page.url.pathname}>Test Suites</BreadcrumbItem>
	</Breadcrumb>

	<div class="mt-px space-y-4">
		<div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
			{#each groups as group}
				<GroupCard group={new Group(group)} />
			{/each}
		</div>
	</div>
</main>

