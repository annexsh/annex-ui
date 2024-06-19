import { newTestClient } from '$lib/services/annex';
import { toPlainMessage } from '@bufbuild/protobuf';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
	const testClient = newTestClient(fetch);
	const res = await testClient.listContexts({});
	return toPlainMessage(res);
};
