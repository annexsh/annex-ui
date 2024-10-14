import { newTestClient } from '$lib/clients';
import { toPlainMessage } from '@bufbuild/protobuf';
import type { LayoutData, LayoutLoad } from './$types';
import type { ListContextsResponse } from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';

export const ssr = false;

export const load: LayoutLoad = async function({ fetch }): LayoutData {
	const testClient = newTestClient(fetch);
	const res = await testClient.listContexts({
		pageSize: 0,
		nextPageToken: ''
	});
	return toPlainMessage<ListContextsResponse>(res);
};
