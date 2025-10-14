import type { HttpFunction } from "@google-cloud/functions-framework";
import { z } from "zod";
import {
  baseOffersByTechnologyOptionsSchema,
  baseOffersByTechnologyScrapingOptionsSchema,
} from "../schemas";
import { justJoinItProviderOptionsSchema } from "../schemas/justjoinit";
import { ScrapingService } from "../services/scraping.service";
import { getScrapingStrategy } from "../strategies";
import { getErrorMessageFromZodError, ValidationError } from "../utils/errors";
import { successResponse, withError } from "../utils/responses";

const getOffersByTechnologySchema = z.intersection(
  z.intersection(
    baseOffersByTechnologyOptionsSchema,
    baseOffersByTechnologyScrapingOptionsSchema
  ),
  justJoinItProviderOptionsSchema
);

const DEFAULT_ITEMS_PER_PAGE = 100;
const DEFAULT_MAX_OFFERS = 1000;
const DEFAULT_MAX_ITERATIONS = 1;
const DEFAULT_CONCURRENCY_LIMIT = 5;
const DEFAULT_CURRENCY = "pln";
const DEFAULT_ORDER_BY = "DESC";
const DEFAULT_SORT_BY = "published";
const DEFAULT_CITY_RADIUS_KM = 30;

export const getOffersByTechnology: HttpFunction = withError(
  async (req, res) => {
    const result = getOffersByTechnologySchema.safeParse(req.query);
    if (!result.success) {
      throw new ValidationError(getErrorMessageFromZodError(result.error));
    }

    const {
      board,
      technology,
      itemsPerPage,
      maxOffers,
      maxIterations,
      concurrencyLimit,
      currency,
      orderBy,
      sortBy,
      cityRadiusKm,
    } = result.data;

    const scrapingOptions = {
      itemsPerPage: itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE,
      maxOffers: maxOffers ?? DEFAULT_MAX_OFFERS,
      maxIterations: maxIterations ?? DEFAULT_MAX_ITERATIONS,
      concurrencyLimit: concurrencyLimit ?? DEFAULT_CONCURRENCY_LIMIT,
      providerOptions: {
        currency: currency ?? DEFAULT_CURRENCY,
        orderBy: orderBy ?? DEFAULT_ORDER_BY,
        sortBy: sortBy ?? DEFAULT_SORT_BY,
        cityRadiusKm: cityRadiusKm ?? DEFAULT_CITY_RADIUS_KM,
      },
    };

    const strategy = getScrapingStrategy(board, scrapingOptions);
    const scrapingService = new ScrapingService<typeof technology>(strategy);

    const { runId, offersCount } =
      await scrapingService.scrapeOffersByTechnology(technology);

    const message =
      offersCount === 0
        ? "API request completed. No offers found."
        : `Successfully fetched and saved ${offersCount} offers.`;

    return successResponse(res, {
      message,
      data: { runId },
    });
  }
);
