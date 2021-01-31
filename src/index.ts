import { OperationWithRollback } from './helpers/interfaces';

export async function asyncOperationsTransaction(
  operationsWithRollback: OperationWithRollback[]
) {
  const successResults = await Promise.all(
    operationsWithRollback.map((op) =>
      op.asyncOperation.operation
        .call(null, ...op.asyncOperation.args)
        .catch((err: Error) => err)
    )
  );

  const needRollback = successResults.some((result) => result instanceof Error);

  if (needRollback) {
    const failureResults = await Promise.all(
      operationsWithRollback.map((op) =>
        op.rollback.operation.call(null, ...op.rollback.args)
      )
    );
    return [false, failureResults];
  }

  return [true, successResults];
}
