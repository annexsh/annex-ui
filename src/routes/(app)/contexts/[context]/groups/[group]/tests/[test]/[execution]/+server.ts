import { newEventClient } from '$lib/services/annex';


export async function GET({ url, fetch }) {
	const context = url.searchParams.get('context');
	const testExecutionId = url.searchParams.get('testExecutionId');

	// Handle cancellation
	const abortController = new AbortController();

	const eventClient = newEventClient(fetch);
	const stream = eventClient.streamTestExecutionEvents({
		context: context!,
		testExecutionId: testExecutionId!
	}, { signal: abortController.signal });

	const readableStream = new ReadableStream({
		async start(controller) {
			try {
				for await (const res of stream) {
					controller.enqueue(JSON.stringify(res.toJson()) + '\n');
				}
			} catch (e) {
				if (abortController.signal.aborted) {
					console.log('Stream aborted');
				} else {
					console.error('Stream error:', e);
				}
			} finally {
				controller.close();
			}
		},
		cancel() {
			abortController.abort();
		}
	});

	return new Response(readableStream, {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-cache'
		}
	});
}