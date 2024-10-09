import { newTestClient } from '$lib/clients';
import { toPlainMessage } from '@bufbuild/protobuf';
import type { PageServerLoad } from './$types';
import type { ListTestSuitesResponse } from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const testClient = newTestClient(fetch);
	const res = await testClient.listTestSuites({
		context: params.context
	});
	return toPlainMessage<ListTestSuitesResponse>(res);
};
