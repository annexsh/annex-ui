import { newTestClient } from '$lib/services/annex';
import type { PageServerLoad } from './$types';
import { toPlainMessage } from '@bufbuild/protobuf';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const testClient = newTestClient(fetch);
	const res = await testClient.listTestExecutions({
		context: params.context,
		testId: params.test
	});
	return toPlainMessage(res);
};


export const actions = {
	executeTest: async (event) => {
		const testClient = newTestClient(fetch);
		const res = await testClient.executeTest({
			context: event.params.context,
			testId: event.params.test
		});
		return toPlainMessage(res);
	}
};