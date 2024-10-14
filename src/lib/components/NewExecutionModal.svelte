<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import { Payload } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';
	import { newTestClient } from '$lib/clients';
	import { loadTestExecutions } from '$lib/stores/test-executions';

	export let open: boolean = false; // modal control
	export let context: string;
	export let testId: string;
	export let defaultInput: string;

	let value = defaultInput;
	let initialized = false;

	async function handleSubmit() {
		let input: Payload | undefined;

		if (value) {
			const encoder = new TextEncoder();
			const inputJSON = JSON.parse(JSON.stringify(value));
			input = new Payload({
				data: Uint8Array.from(encoder.encode(inputJSON)),
				metadata: {
					encoding: Uint8Array.from(encoder.encode('json/plain'))
				}
			});
		}

		const testClient = newTestClient(fetch);
		await testClient.executeTest({
			context: context,
			testId: testId,
			input: input
		});

		await loadTestExecutions(newTestClient(fetch), context, testId);
		open = false
	}

	try {
		if (!initialized && defaultInput != '') {
			const parsed = JSON.parse(defaultInput);
			value = JSON.stringify(parsed, null, 2);
			initialized = true;
		}
	} catch (e) {
		// TODO: handle error
		console.log(e);
	}
</script>

<form on:submit={handleSubmit}>
	<Modal bind:open title="New Execution" size="lg" class="m-4" autoclose={false} outsideclose>
		<div class="space-y-6 p-0">
			<div class="grid grid-cols-6 gap-6">
				<div class="col-span-6 space-y-2">
					<span>Input</span>
					{#if defaultInput === ""}
						<CodeEditor value="N/A" readonly={true} editable={false} disabled={true} />
					{:else}
						<input type="hidden" name="input" value={value}>
						<CodeEditor bind:value jsonLang={true} />
					{/if}
				</div>
			</div>
		</div>

		<div slot="footer">
			<Button type="submit">Execute</Button>
		</div>
	</Modal>
</form>