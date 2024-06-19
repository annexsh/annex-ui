import { base } from '$app/paths';

export const contextsRoute = `${base}/contexts`;

export const contextRoute = (context: string): string => {
	return `${contextsRoute}/${context}`;
};

export const groupsRoute = (context: string): string => {
	return `${contextRoute(context)}/groups`;
};

export const groupRoute = (context: string, group: string): string => {
	return `${groupsRoute(context)}/${group}`;
};

export const testRoute = (context: string, group: string, testId: string): string => {
	return `${groupRoute(context, group)}/tests/${testId}`;
};

export const testExecutionRoute = (context: string, group: string, testId: string, executionId: string): string => {
	return `${testRoute(context, group, testId)}/${executionId}`;
};