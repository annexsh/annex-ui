<script lang="ts">
	import { FolderOpenSolid } from 'flowbite-svelte-icons';

	export let title: string;
	export let message = '';
</script>

<div class="flex mt-40 items-center justify-center">
	<FolderOpenSolid class="text-gray-500 dark:text-gray-400 size-12" />
</div>
<div class="text-center text-gray-500">
	<p class="text-2xl font-medium mb-2">{title}</p>
	{#if message}
		<p class="text-base">{message}</p>
	{/if}
</div>
