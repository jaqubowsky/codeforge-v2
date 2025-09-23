export const executeInBatches = async <T, R>(
  items: T[],
  asyncOperation: (item: T) => Promise<R | null>,
  concurrencyLimit: number
): Promise<R[]> => {
  const results: R[] = [];

  for (let i = 0; i < items.length; i += concurrencyLimit) {
    const batch = items.slice(i, i + concurrencyLimit);
    const batchPromises = batch.map(asyncOperation);

    const batchResults = await Promise.all(batchPromises);
    const successfulResults = batchResults.filter(
      (result): result is Awaited<R> => result !== null
    );

    results.push(...successfulResults);
  }

  return results;
};
