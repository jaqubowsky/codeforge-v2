"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeHandler = exports.scrapeHandlerSchema = void 0;
const zod_1 = require("zod");
const errors_1 = require("./utils/errors");
const page_scraper_1 = require("./utils/page-scraper");
const responses_1 = require("./utils/responses");
const VALID_URLS = ["https://justjoin.it"];
exports.scrapeHandlerSchema = zod_1.z.object({
    url: zod_1.z.literal(VALID_URLS),
});
exports.scrapeHandler = (0, responses_1.withError)(async (req, res) => {
    const body = req.body;
    const result = exports.scrapeHandlerSchema.safeParse(body);
    if (!result.success) {
        throw new errors_1.ValidationError(result.error);
    }
    throw new errors_1.NotFoundError("Not found");
    const content = await (0, page_scraper_1.scrapePage)(result.data.url);
    return (0, responses_1.successResponse)(res, {
        data: {
            content,
        },
    });
});
