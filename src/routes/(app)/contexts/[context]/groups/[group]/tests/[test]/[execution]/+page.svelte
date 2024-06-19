<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Event } from '$lib/clients/annex/events/v1/event_pb';
	import { StreamTestExecutionEventsResponse } from '$lib/clients/annex/events/v1/event_service_pb';

	const params = $page.params;
	const context = params.context;
	const testExecutionId = params.execution;

	let events: Event[] = [];

	async function subscribe() {
		try {
			const eventsURL = `${$page.url}?context=${context}&testExecutionId=${testExecutionId}`;
			const response = await fetch(eventsURL);
			if (!response || !response.body) {
				console.error("stream response empty")
				return
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
								console.error("stream event is empty")
								return
							}
							events = [...events, message.event];
					}
					buffer = buffer.slice(boundary + 1);
					boundary = buffer.indexOf('\n');
				}
			}

			if (buffer.trim()) {
					const message = JSON.parse(buffer.trim());
					events = [...events, message.event];
			}
		} catch (e) {
			console.error('Failed to stream: '+ e)
		}
	}

	onMount(subscribe);
</script>

<ul>
	{#each events as event}
		<li>{event.eventId}</li> <!-- Replace with your actual field -->
	{/each}
</ul>