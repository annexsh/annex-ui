import { type Writable, writable } from 'svelte/store';
import { type PlainMessage, toPlainMessage } from '@bufbuild/protobuf';
import type { ListTestExecutionsResponse } from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';
import type { PromiseClient } from '@connectrpc/connect';
import type { TestService } from '@annexsh/annex-proto';
import type { TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';

export const testExecutions: Writable<PlainMessage<TestExecution>[]> = writable([]);

export async function loadTestExecutions(client: PromiseClient<typeof TestService>, context: string, testId: string) {
	try {
		const res = await client.listTestExecutions({ context, testId });
		testExecutions.set(toPlainMessage<ListTestExecutionsResponse>(res).testExecutions);
	} catch (e) {
		console.log(e); // TODO: error handle
	}
}
