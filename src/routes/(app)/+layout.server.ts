import { newTestClient } from '$lib/clients';
import { toPlainMessage } from '@bufbuild/protobuf';
import type { LayoutServerLoad } from './$types';
import type { ListContextsResponse } from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const testClient = newTestClient(fetch);
	const res = await testClient.listContexts();
	return toPlainMessage<ListContextsResponse>(res);
};
