<script lang="ts">
	import { Card, Heading } from 'flowbite-svelte';
	import More from '$lib/components/widgets/More.svelte';
	import type { Test } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb.js';
	import { testRoute } from '$lib/routes';

	export let test: Test;

</script>

<Card size="xl" class="shadow-sm max-w-none">
	<div class="items-center justify-between lg:flex">
		<div class="mb-4 mt-px lg:mb-0">
			<Heading tag="h3" class="-ml-0.25 mb-2 text-xl font-semibold dark:text-white">
				{test.name}
			</Heading>
		</div>
		<div class="-mt-1">
			<More title="View" href={testRoute(test.context, test.group, test.id)} />
		</div>
	</div>
</Card>
