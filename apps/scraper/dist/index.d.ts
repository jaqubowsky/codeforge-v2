import type { HttpFunction } from "@google-cloud/functions-framework";
import { z } from "zod";
export declare const scrapeHandlerSchema: z.ZodObject<{
    url: z.ZodLiteral<"https://justjoin.it">;
}, z.core.$strip>;
export declare const scrapeHandler: HttpFunction;
//# sourceMappingURL=index.d.ts.map