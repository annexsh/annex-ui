<script lang="ts">
	import { ExecutionStatus, executionStatusColors } from '$lib/models/execution.js';
	import { Badge } from 'flowbite-svelte';

	export let status: ExecutionStatus;
</script>

<!--
Svelte doesn't seem to like reactively updating the color of this badge, therefore we have explicit
if statements to trigger the reactivity.
-->
{#if status === ExecutionStatus.Unknown}
	<Badge large color={executionStatusColors[status]} class="mb-2">{status}</Badge>
{:else if status === ExecutionStatus.Scheduled}
	<Badge large color={executionStatusColors[status]} class="mb-2">{status}</Badge>
{:else if status === ExecutionStatus.Running}
	<Badge large color={executionStatusColors[status]} class="mb-2">{status}</Badge>
{:else if status === ExecutionStatus.Success}
	<Badge large color={executionStatusColors[status]} class="mb-2">{status}</Badge>
{:else if status === ExecutionStatus.Failed}
	<Badge large color={executionStatusColors[status]} class="mb-2">{status}</Badge>
{:else}
	<Badge large color={executionStatusColors[ExecutionStatus.Unknown]} class="mb-2">{ExecutionStatus.Unknown}</Badge>
{/if}
