export declare const executeInBatches: <T, R>(items: T[], asyncOperation: (item: T) => Promise<R | null>, concurrencyLimit: number) => Promise<R[]>;
//# sourceMappingURL=batch-processor.d.ts.map