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
		ButtonGroup,
		Card,
		Dropdown,
		DropdownItem,
		Heading,
		Helper,
		Input,
		Spinner,
		Toolbar
	} from 'flowbite-svelte';
	import {
		type CaseExecutionView,
		ExecutionStatus,
		getExecutionStatus,
		type RestartOption,
		RestartType
	} from '$lib/models/execution';
	import type { CaseExecution, Test, TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';
	import { groupRoute, groupsRoute, testRoute } from '$lib/routes';
	import CodeEditor from '$lib/components/CodeEditor.svelte';
	import { CheckCircleSolid, ChevronDownOutline, ClockSolid, CloseCircleSolid } from 'flowbite-svelte-icons';
	import ExecutionStatusBadge from '$lib/components/ExecutionStatusBadge.svelte';
	import RestartExecutionModal from '$lib/components/RestartExecutionModal.svelte';

	export let data;

	const params = $page.params;
	const group = params.group;
	const context = params.context;
	const test = data.test as Test;
	const testExecution = data.testExecution as TestExecution;

	let events: Event[] = [];
	let cases = new Map<number, CaseExecutionView>();
	let open = false;
	let restartOption: RestartOption;
	let overallStatus = getExecutionStatus(testExecution);

	const items = Array(cases.size);
	const open_all = () => items.forEach((_, i) => (items[i] = true));
	const close_all = () => items.forEach((_, i) => (items[i] = false));

	const restartOptions: RestartOption[] = [
		{
			type: RestartType.AsNew,
			title: 'As new',
			helper: 'Execute without prior history'
		}
	];

	$:if (overallStatus == ExecutionStatus.Failed) {
		restartOptions.push({
			type: RestartType.FromFailure,
			title: 'From failure',
			helper: 'Retry from first recorded failure'
		});
	}
	function updateOverallStatus(status: ExecutionStatus) {
		const isFinished = ExecutionStatus.Success || ExecutionStatus.Failed;
		overallStatus = isFinished ? overallStatus : status;
	}

	onMount(subscribe);

	async function subscribe() {
		updateOverallStatus(ExecutionStatus.Scheduled)

		try {
			const eventsURL = `${$page.url}?context=${context}&testExecutionId=${testExecution.id}`;
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

		updateOverallStatus(ExecutionStatus.Running)

		const eventData = event.data?.data;

		switch (event.type) {
			case Event_Type.TEST_EXECUTION_FINISHED:
				if (eventData.case == 'testExecution') {
					if (eventData.value.error) {
						overallStatus = ExecutionStatus.Failed;
					} else {
						overallStatus = ExecutionStatus.Success;
					}
				}
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
</script>

<main class="p-4 bg-gray-50 dark:bg-gray-900">
	<Breadcrumb class="mb-5">
		<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
		<BreadcrumbItem href={groupsRoute(context)}>Test Suites</BreadcrumbItem>
		<BreadcrumbItem href={groupRoute(context, group)}>{group}</BreadcrumbItem>
		<BreadcrumbItem href={testRoute(context, group, test.id)}>{test.name}</BreadcrumbItem>
		<BreadcrumbItem href={$page.url.pathname}>{testExecution.id}</BreadcrumbItem>
	</Breadcrumb>

	<div>
		<ExecutionStatusBadge status={overallStatus} />
		<div class="mb-6 items-center sm:flex">
			<div class="mb-4 w-full sm:mb-0">
				<span class="text-3xl font-bold leading-none text-gray-900 dark:text-white sm:text-4xl">{test.name}</span>
				<h3 class="text-base font-normal text-gray-500 dark:text-gray-400 mt-1">{testExecution.id}</h3>
			</div>
			<Button size="sm">Restart
				<ChevronDownOutline class="w-6 h-6 ms-2 text-white dark:text-white" />
			</Button>
			<Dropdown class="w-60 p-3 space-y-1 text-sm">
				{#each restartOptions as option }
					<DropdownItem class="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-600" on:click={() => {
						open = true
						restartOption = option
					}}>
						{option.title}
						<Helper>{option.helper}</Helper>
					</DropdownItem>
				{/each}
			</Dropdown>
		</div>

		<Card size="xl" class="shadow-sm max-w-none max-h-[75vh] dark">
			<Heading tag="h2" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl w-full pb-2">
				Cases
			</Heading>

			<Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
				<Input placeholder="Search for case" class="me-4 w-80 border xl:w-96" />

				<div slot="end" class="flex items-center space-x-2">
					<ButtonGroup>
						<Button outline={false} class="mr-2" size="xs" on:click={open_all}>Open all</Button>
						<Button size="xs" on:click={close_all}>Close all</Button>
					</ButtonGroup>


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
						{:else if status === ExecutionStatus.Failed}
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

<!-- Modals -->
<RestartExecutionModal bind:open bind:restartOption />