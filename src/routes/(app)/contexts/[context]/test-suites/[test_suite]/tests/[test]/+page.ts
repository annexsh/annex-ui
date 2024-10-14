import { newTestClient } from '$lib/clients';
import type { PageLoad } from './$types';
import { toPlainMessage } from '@bufbuild/protobuf';
import type { GetTestResponse } from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';

export const load: PageLoad = async ({ params, fetch }) => {
	const testClient = newTestClient(fetch);

	const testRes = await testClient.getTest({
		context: params.context,
		testId: params.test
	});

	let defaultInput = '';

	if (testRes.test!.hasInput) {
		const inputRes = await testClient.getTestDefaultInput({
			context: params.context,
			testId: params.test
		});
		defaultInput = inputRes.defaultInput;
	}

	return {
		test: toPlainMessage<GetTestResponse>(testRes).test,
		defaultInput: defaultInput
	};
};
