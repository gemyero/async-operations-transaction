interface Operation {
  operation: (...args: any[]) => Promise<any>;
  args?: any[];
}

export interface OperationWithRollback {
  asyncOperation: Operation;
  rollback: Operation;
}
