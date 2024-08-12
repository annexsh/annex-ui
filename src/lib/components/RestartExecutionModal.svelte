<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import { type RestartOption, RestartType } from '$lib/models/execution';

	export let open: boolean = false; // modal control
	export let restartOption: RestartOption;
	export let input = '';

	let value: string;

	try {
		if (input !== '') {
			const parsed = JSON.parse(input);
			value = JSON.stringify(parsed, null, 2);
		}
	} catch (e) {
		// TODO: handle error
		console.log(e);
	}
</script>

<form method="POST">
	<Modal bind:open title="Restart Execution" size="lg" class="m-4" autoclose={false} outsideclose>
		<div class="space-y-6 p-0">
			<div class="grid grid-cols-6 gap-6">
				<div class="col-span-6 space-y-2">
					<span>Input</span>
					{#if input === ''}
						<CodeEditor value="N/A" readonly={true} editable={false} disabled={true} />
					{:else}
						<input type="hidden" name="input" value={value}>
						<CodeEditor bind:value jsonLang={true} readonly={true} editable={false} />
					{/if}
				</div>
			</div>
		</div>

		<div slot="footer">
			{#if restartOption.type === RestartType.FromFailure}
				<Button type="submit">Execute</Button>
			{:else}
				<p class="text-base font-normal text-gray-500 dark:text-gray-400 mb-4">{`Restart '${restartOption.title}' is not currently supported`}</p>
				<Button disabled type="submit">Execute</Button>
			{/if}
		</div>
	</Modal>
</form>