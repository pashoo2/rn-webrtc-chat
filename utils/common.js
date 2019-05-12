export function poll(checkFn, timeout = 5000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    let handle = setInterval(() => {
      const elapsed = Date.now() - start;
      if (checkFn()) {
        clearInterval(handle);
        resolve();
      }
      if (elapsed > timeout) {
        clearInterval(handle);
        reject(new Error('poll timeout'));
      }
    }, 100);
  });
}
