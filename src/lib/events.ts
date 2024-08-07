import { Event, StreamTestExecutionEventsResponse } from '@annexsh/annex-proto';

export async function subscribeTestExecutionEvents(url: string) {
	let events: Event[] = [];

	try {
		const response = await fetch(url);
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
		console.error('Failed to stream: ' + e);
	}

	return events
}