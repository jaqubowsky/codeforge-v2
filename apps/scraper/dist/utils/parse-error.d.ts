export declare class ExposedError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare const parseError: (error: unknown) => {
    error: string;
    message: string;
    statusCode: number;
};
//# sourceMappingURL=parse-error.d.ts.map