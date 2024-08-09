import { CaseExecution, Log, TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';
import type { ColorVariant } from 'flowbite-svelte';

export type CaseExecutionView = {
	execution: CaseExecution
	logs: Log[]
}

export enum ExecutionStatus {
	Unknown = 'Unknown',
	Success = 'Success',
	Error = 'Error',
	Running = 'Running',
	Scheduled = 'Scheduled',
}

export const executionStatusColors: { [key in ExecutionStatus]: ColorVariant } = {
	[ExecutionStatus.Unknown]: 'dark',
	[ExecutionStatus.Success]: 'green',
	[ExecutionStatus.Error]: 'red',
	[ExecutionStatus.Running]: 'blue',
	[ExecutionStatus.Scheduled]: 'yellow'
};

export function getExecutionStatus(execution: TestExecution | CaseExecution): ExecutionStatus {
	if (execution.finishTime) {
		if (execution.error) {
			return ExecutionStatus.Error;
		}
		return ExecutionStatus.Success;
	} else if (execution.startTime) {
		return ExecutionStatus.Running;
	} else if (execution.scheduleTime) {
		return ExecutionStatus.Scheduled;
	}
	return ExecutionStatus.Unknown;
}