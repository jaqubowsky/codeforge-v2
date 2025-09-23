import type { HttpFunction, Request, Response } from "@google-cloud/functions-framework";
export declare const STATUS_CODES: {
    readonly SUCCESS: 200;
    readonly BAD_REQUEST: 400;
    readonly VALIDATION_ERROR: 422;
    readonly INTERNAL_SERVER_ERROR: 500;
    readonly NOT_FOUND: 404;
};
type SuccessResponseData<T = unknown> = {
    message?: string;
    data: T;
};
export declare const successResponse: <T>(res: Response, data: SuccessResponseData<T>) => Response<any, Record<string, any>>;
export declare const withError: (fn: HttpFunction) => (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=responses.d.ts.map