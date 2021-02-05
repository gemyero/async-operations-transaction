import test from 'ava';
import asyncOperationsTransaction from '../src';
import makePromise from './make-promise';

test('Transaction success!', async (t) => {
  const { isSuccessful, operationsResults } = await asyncOperationsTransaction([
    { asyncOperation: makePromise(1000) },
    { asyncOperation: makePromise(2000) },
    { asyncOperation: makePromise(3000) },
  ]);

  t.true(isSuccessful);
  t.is(operationsResults.length, 3);
  t.is(operationsResults[0], 'resolved');
});

test('Transaction fail and rollback is executed!', async (t) => {
  const { isSuccessful, rollbackResults, operationsResults } = await asyncOperationsTransaction([
    {
      asyncOperation: makePromise(1000),
      rollback: async (asyncOperationResult) => {
        t.is(asyncOperationResult, 'resolved');
        return `${asyncOperationResult}-rollback1`;
      },
    },
    { asyncOperation: makePromise(2000, 'reject'), rollback: async () => 'rollback2' },
    { asyncOperation: makePromise(3000), rollback: async () => 'rollback3' },
  ]);

  t.false(isSuccessful);
  t.is(rollbackResults.length, 3);
  t.is(operationsResults.length, 3);
  t.is(operationsResults[0], 'resolved');
  t.is(rollbackResults[0], 'resolved-rollback1');
  t.is(operationsResults[1].message, 'rejected!');
});
