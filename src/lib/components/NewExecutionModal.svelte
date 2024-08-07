<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import CodeEditor from '$lib/components/CodeEditor.svelte';

	export let open: boolean = false; // modal control

	export let defaultInput: string;

	let value = defaultInput;
	let initialized = false;

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

<form method="POST">
	<Modal bind:open title="New Execution" size="lg" class="m-4" autoclose={false} outsideclose>
		<!-- Modal body -->
		<div class="space-y-6 p-0">
			<div class="grid grid-cols-6 gap-6">
				<div class="col-span-6 space-y-2">
					<span>Input</span>
					{#if defaultInput === ""}
						<CodeEditor value="N/A" readonly={true} editable={false} disabled={true}/>
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