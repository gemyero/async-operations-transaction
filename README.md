# Async Operations Transaction

A library which facilitates the senario of attempting to execute a transaction of asynchrounous operations.

## Installation

```shell
npm install async-operations-transaction
```

## Usage


```typescript
import asyncOperationsTransaction from 'async-operations-transaction';

(async () => {
  const { isSuccessful, operationsResults, rollbackResults } = await asyncOperationsTransaction([
    { asyncOperation: asyncFunction1, rollback: asyncRollback1 },
    { asyncOperation: asyncFunction2, rollback: asyncRollback2 },
  ]);

  console.log({
    isSuccessful,
    operationsResults,
    rollbackResults,
  });
})();

```

The previous code example shows how to use the exported function which accepts and array of objects. Each object has `asyncOperation` which is a function that returns a promise and `rollback` which is another function that returns a promise to execute if the `asyncOperation` rejects to rollback the action.

## Features
- Each rollback async function is called with the result of corresponding async opertaion. 

## Roadmap
- Adding retry mechanism.