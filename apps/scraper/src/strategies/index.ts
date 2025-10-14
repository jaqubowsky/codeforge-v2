import type { JobBoard, ScrapingOptions, ScrapingStrategy } from "../types";
import { NotFoundError } from "../utils/errors";
import { JustJoinItStrategy } from "./just-join-it/just-join-it.strategy";

type StrategyConstructor = new (options: ScrapingOptions) => ScrapingStrategy;

const strategies: Record<JobBoard, StrategyConstructor> = {
  justjoinit: JustJoinItStrategy,
};

export const getScrapingStrategy = (
  board: JobBoard,
  scrapingOptions: ScrapingOptions
): ScrapingStrategy => {
  const StrategyClass = strategies[board];

  if (!StrategyClass) {
    throw new NotFoundError(`No strategy found for board: ${board}`);
  }

  return new StrategyClass(scrapingOptions);
};
