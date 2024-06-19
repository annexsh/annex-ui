import { newTestClient } from '$lib/services/annex';
import { toPlainMessage } from '@bufbuild/protobuf';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const testClient = newTestClient(fetch);
	const res = await testClient.listTests({
		context: params.context,
		group: params.group
	});
	return toPlainMessage(res);
};
