const chunk = <T>(array: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, (i + 1) * size)
  );
};

export const executeInBatches = async <T, R>(
  items: T[],
  asyncOperation: (item: T) => Promise<R | null>,
  concurrencyLimit: number
): Promise<R[]> => {
  const results: R[] = [];

  const chunks = chunk(items, concurrencyLimit);

  for (const batch of chunks) {
    const batchResults = await Promise.all(batch.map(asyncOperation));
    results.push(...batchResults.filter((r): r is Awaited<R> => r !== null));
  }

  return results;
};
