<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { groupRoute, groupsRoute } from '$lib/routes';

	export let data;

	onMount(() => {
		const context = $page.params.context;
		const groups = data.groups;
		if (groups.length) {
			goto(groupRoute(context, groups[0].name));
		} else {
			goto(groupsRoute(context))
		}
	});
</script>
