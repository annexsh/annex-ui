<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Event, Event_Type, StreamTestExecutionEventsResponse } from '@annexsh/annex-proto';
	import {
		Accordion,
		AccordionItem,
		Breadcrumb,
		BreadcrumbItem,
		Button,
		Card,
		Heading,
		Input,
		Spinner,
		Toolbar
	} from 'flowbite-svelte';
	import { type CaseExecutionView, ExecutionStatus, getExecutionStatus } from '$lib/models/execution';
	import type { CaseExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';
	import { groupRoute, groupsRoute, testRoute } from '$lib/routes';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import { CheckCircleSolid, ClockSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
	import type { Test } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb.js';

	export let data;

	const params = $page.params;
	const group = params.group;
	const context = params.context;
	const test = data.test as Test;
	const testExecutionId = params.execution;

	let events: Event[] = [];
	let cases = new Map<number, CaseExecutionView>();

	onMount(subscribe);

	async function subscribe() {
		try {
			const eventsURL = `${$page.url}?context=${context}&testExecutionId=${testExecutionId}`;
			const response = await fetch(eventsURL);
			if (!response || !response.body) {
				console.error('stream response empty');
				return;
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();
			let buffer = '';

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });

				let boundary = buffer.indexOf('\n');
				while (boundary !== -1) {
					const chunk = buffer.slice(0, boundary).trim();
					if (chunk) {
						const message = new StreamTestExecutionEventsResponse().fromJson(JSON.parse(chunk));
						if (!message.event) {
							console.error('stream event is empty');
							return;
						}
						handleEvent(message.event);
					}
					buffer = buffer.slice(boundary + 1);
					boundary = buffer.indexOf('\n');
				}
			}

			if (buffer.trim()) {
				const message = JSON.parse(buffer.trim());
				handleEvent(message.event);
			}
		} catch (e) {
			console.error('Failed to stream: ' + e);
		}
	}

	function handleEvent(event: Event) {
		events = [...events, event];
		if (event.type == Event_Type.UNSPECIFIED || !event.data || !event.data.data.value) {
			return; // unknown event
		}

		const eventData = event.data?.data;


		switch (event.type) {
			case Event_Type.TEST_EXECUTION_FINISHED:
				break;
			case Event_Type.CASE_EXECUTION_SCHEDULED:
			case Event_Type.CASE_EXECUTION_STARTED:
			case Event_Type.CASE_EXECUTION_FINISHED:
				if (eventData.case == 'caseExecution') {
					const existing = cases.get(eventData.value.id);
					const view = {
						execution: <CaseExecution>eventData.value,
						logs: existing ? existing.logs : []
					} as CaseExecutionView;
					cases.set(<number>eventData.value.id, view);
				}
				break;
			case Event_Type.LOG_PUBLISHED:
				if (eventData.case == 'log') {
					const log = eventData.value;
					const caseExecId = log.caseExecutionId;

					if (caseExecId) {
						const caseView = cases.get(caseExecId);
						if (caseView) {
							caseView.logs.push(log);
							cases.set(caseExecId, caseView);
						}
					}
				}
				break;
		}

		// Trigger Svelte reactivity
		cases = cases;
	}

	function caseLogsString(caseView: CaseExecutionView | undefined): string {
		if (!caseView || !caseView.logs) {
			return '';
		}

		let logsStr = '';
		for (const log of caseView.logs) {
			const line = '[' + log.level + '] ' + log.message;
			logsStr = `${logsStr}${line}\n`;
		}
		return logsStr.replace(/[\r\n]+$/, ''); // trim new line at end of string
	}

	const items = Array(cases.size);
	const open_all = () => items.forEach((_, i) => (items[i] = true));
	const close_all = () => items.forEach((_, i) => (items[i] = false));
</script>

<main class="p-4 bg-gray-50 dark:bg-gray-900">
	<Breadcrumb class="mb-5">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href={groupsRoute(context)}>Test Suites</BreadcrumbItem>
		<BreadcrumbItem href={groupRoute(context, group)}>{group}</BreadcrumbItem>
		<BreadcrumbItem href={testRoute(context, group, test.id)}>{test.name}</BreadcrumbItem>
		<BreadcrumbItem href={$page.url.pathname}>{testExecutionId}</BreadcrumbItem>
	</Breadcrumb>

	<div>
		<Heading tag="h1" class="text-4xl font-extrabold text-gray-900 dark:text-white pl-1 pb-3">
			{test.name}
		</Heading>
		<h3 class="text-base font-normal text-gray-500 dark:text-gray-400 pl-1 pb-5">{testExecutionId}</h3>

		<Card size="xl" class="shadow-sm max-w-none max-h-[75vh] dark">
			<Heading tag="h2" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl w-full pb-2">
				Cases
			</Heading>

			<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
				<Input placeholder="Search for case" class="me-4 w-80 border xl:w-96" />

				<div slot="end" class="flex items-center space-x-2">
					<Button class="mr-2" size="sm" on:click={open_all}>Open all</Button>
					<Button size="sm" on:click={close_all}>Close all</Button>
				</div>
			</Toolbar>

			<Accordion multiple>
				{#each cases.keys() as caseID, i}
					{@const caseView=cases.get(caseID)}
					{#if caseView}
						{@const execution=caseView.execution}
						{@const status=getExecutionStatus(caseView.execution)}
						<AccordionItem bind:open={items[i]} transitionParams="{{duration:30}}">
					<span slot="header" class="text-base flex gap-2">
						{#if status === ExecutionStatus.Scheduled}
							<ClockSolid class="text-gray-600 dark:text-gray-400 inline m-1" ariaLabel="success" />
						{:else if status === ExecutionStatus.Running}
							<Spinner class="m-1.5" color="gray" size={4} />
						{:else if status === ExecutionStatus.Success}
							<CheckCircleSolid class="text-green-600 dark:text-green-400 inline m-1" ariaLabel="success" />
						{:else if status === ExecutionStatus.Error}
							<CloseCircleSolid class="text-red-600 dark:text-red-400 inline m-1" ariaLabel="error" />
						{/if}
						<span>{execution.caseName}</span>
					</span>
							<CodeEditor value={caseLogsString(caseView)} readonly={true} editable={false} />
						</AccordionItem>
					{/if}
				{/each}
			</Accordion>
		</Card>
	</div>
</main>
