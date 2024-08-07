import { newTestClient } from '$lib/clients';
import type { PageServerLoad } from './$types';
import { toPlainMessage } from '@bufbuild/protobuf';
import type {
	ExecuteTestResponse,
	GetTestDefaultInputResponse,
	ListTestExecutionsResponse
} from '@annexsh/annex-proto/gen/annex/tests/v1/test_service_pb';
import { Payload } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const testClient = newTestClient(fetch);

	const inputRes = await testClient.getTestDefaultInput({
		context: params.context,
		testId: params.test
	});

	const testExecsRes = await testClient.listTestExecutions({
		context: params.context,
		testId: params.test
	});

	return {
		defaultInput: toPlainMessage<GetTestDefaultInputResponse>(inputRes).defaultInput,
		testExecutions: toPlainMessage<ListTestExecutionsResponse>(testExecsRes).testExecutions
	};
};


export const actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const formInput = formData.get('input');

		let input: Payload;

		if (formInput && Object.keys(formInput).length > 0) {
			const encoder = new TextEncoder();
			const inputJSON = JSON.parse(JSON.stringify(formInput));
			input = new Payload({
				data: Uint8Array.from(encoder.encode(inputJSON)),
				metadata: {
					encoding: Uint8Array.from(encoder.encode('json/plain'))
				}
			});
		}

		const testClient = newTestClient(fetch);
		const res = await testClient.executeTest({
			context: event.params.context,
			testId: event.params.test,
			input: input
		});
		return toPlainMessage<ExecuteTestResponse>(res);
	}
};