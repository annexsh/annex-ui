import { newTestClient } from '$lib/clients';
import type { PageLoad } from './$types';
import { toPlainMessage } from '@bufbuild/protobuf';
import type {
	GetTestExecutionResponse,
	GetTestResponse
} from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';

export const load: PageLoad = async ({ params, fetch }) => {
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
