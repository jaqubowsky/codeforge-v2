"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeInBatches = void 0;
const executeInBatches = async (items, asyncOperation, concurrencyLimit) => {
    const results = [];
    for (let i = 0; i < items.length; i += concurrencyLimit) {
        const batch = items.slice(i, i + concurrencyLimit);
        const batchPromises = batch.map(asyncOperation);
        const batchResults = await Promise.all(batchPromises);
        const successfulResults = batchResults.filter((result) => result !== null);
        results.push(...successfulResults);
    }
    return results;
};
exports.executeInBatches = executeInBatches;
