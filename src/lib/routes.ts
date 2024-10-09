import { base } from '$app/paths';

export const contextsRoute = `${base}/contexts`;

export const contextRoute = (context: string): string => {
	return `${contextsRoute}/${context}`;
};

export const testSuitesRoute = (context: string): string => {
	return `${contextRoute(context)}/test-suites`;
};

export const testSuiteRoute = (context: string, testSuiteId: string): string => {
	return `${testSuitesRoute(context)}/${testSuiteId}`;
};

export const testRoute = (context: string, testSuiteId: string, testId: string): string => {
	return `${testSuiteRoute(context, testSuiteId)}/tests/${testId}`;
};

export const testExecutionRoute = (context: string, testSuiteId: string, testId: string, executionId: string): string => {
	return `${testRoute(context, testSuiteId, testId)}/${executionId}`;
};