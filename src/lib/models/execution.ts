import { CaseExecution, Log, TestExecution } from '@annexsh/annex-proto/gen/annex/tests/v1/test_pb';

export enum ExecutionStatus {
	Unknown = 'Unknown',
	Success = 'Success',
	Error = 'Error',
	Running = 'Running',
	Scheduled = 'Scheduled',
}

export type CaseExecutionView = {
	execution: CaseExecution
	logs: Log[]
}

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