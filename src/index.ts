interface OperationWithRollback {
  asyncOperation: (...args: any[]) => Promise<any>;
  rollback?: (...args: any[]) => Promise<any>;
}

async function asyncOperationsTransaction(
  operationsWithRollback: OperationWithRollback[]
): Promise<[boolean, any[]]> {
  const operationsResults = await Promise.all(
    operationsWithRollback.map((op) =>
      op.asyncOperation().catch((err: Error) => err)
    )
  );

  const needRollback = operationsResults.some(
    (result) => result instanceof Error
  );

  if (needRollback) {
    const rollbackResults = await Promise.all(
      operationsWithRollback.map((op) => {
        if (op.rollback) {
          return op.rollback();
        }
        return null;
      })
    );
    return [false, rollbackResults];
  }

  return [true, operationsResults];
}

export default asyncOperationsTransaction;
