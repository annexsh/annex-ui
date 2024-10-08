import { newTestClient } from '$lib/clients';
import type { PageServerLoad } from './$types';
import { toPlainMessage } from '@bufbuild/protobuf';
import type {
	GetTestExecutionResponse,
	GetTestResponse
} from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const testClient = newTestClient(fetch);

	const testRes = await testClient.getTest({
		context: params.context,
		testId: params.test
	});

	const testExecRes = await testClient.getTestExecution({
		context: params.context,
		testExecutionId: params.execution
	})

	return {
		test: toPlainMessage<GetTestResponse>(testRes).test,
		testExecution: toPlainMessage<GetTestExecutionResponse>(testExecRes).testExecution
	};
};

export const actions = {
	default: async (event) => {
		const params = event.params;

		const testClient = newTestClient(fetch);

		// TODO: handle error
		await testClient.retryTestExecution({
			context: params.context,
			testExecutionId: params.execution
		});
	}
};