function makePromise(ms: number, mode: 'resolve' | 'reject' = 'resolve') {
  return () => new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === 'resolve') return resolve('resolved');
      return reject(new Error('rejected!'));
    }, ms);
  });
}

export default makePromise;
