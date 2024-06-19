import { createConnectTransport } from '@connectrpc/connect-web';
import { createPromiseClient } from '@connectrpc/connect';
import { TestService } from '$lib/clients/annex/tests/v1/test_service_connect';
import { EventService } from '$lib/clients/annex/events/v1/event_service_connect';
import type { ServiceType } from '@bufbuild/protobuf';

export function newTestClient(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
	return newPromiseClient(TestService, fetch);
}

export function newEventClient(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
	return newPromiseClient(EventService, fetch);
}

function newPromiseClient<T extends ServiceType>(service: T, fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
	return createPromiseClient(service, newConnectTransport(fetch));
}

export function newConnectTransport(fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>) {
	return createConnectTransport({
		baseUrl: 'http://localhost:50051/connect',
		fetch
	});
}