interface OperationWithRollback {
  asyncOperation: (...args: any[]) => Promise<any>;
  rollback?: (...args: any[]) => Promise<any>;
}

interface AsyncOperationsTransactionResult {
  isSuccessful: boolean,
  operationsResults: any[],
  rollbackResults?: any[]
}

async function asyncOperationsTransaction(
  operationsWithRollback: OperationWithRollback[],
): Promise<AsyncOperationsTransactionResult> {
  const operationsResults = await Promise.allSettled(
    operationsWithRollback.map((op) => op.asyncOperation()),
  );

  const needRollback = operationsResults.some(
    (result) => result.status === 'rejected',
  );

  if (needRollback) {
    const rollbackResults = await Promise.allSettled(
      operationsWithRollback.map((op, index) => {
        const asyncOperationResult = operationsResults[index].status === 'fulfilled'
          ? (operationsResults[index] as any).value : (operationsResults[index] as any).reason;
        if (op.rollback) {
          return op.rollback(asyncOperationResult);
        }
        return null;
      }),
    );
    return {
      isSuccessful: false,
      operationsResults: operationsResults
        .map((result) => (result.status === 'fulfilled' ? result.value : result.reason)),
      rollbackResults: rollbackResults
        .map((result) => (result.status === 'fulfilled' ? result.value : result.reason)),
    };
  }

  return {
    isSuccessful: true,
    operationsResults: operationsResults
      .map((result) => (result.status === 'fulfilled' ? result.value : result.reason)),
  };
}

export default asyncOperationsTransaction;
