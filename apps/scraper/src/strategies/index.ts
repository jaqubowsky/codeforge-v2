import { NotFoundError } from "../utils/errors";
import { JustJoinItStrategy } from "./just-join-it/just-join-it.strategy";
import type { ScrapingStrategy } from "./strategy";

const strategies = [
  {
    name: "justjoin.it",
    strategy: new JustJoinItStrategy(),
  },
];

export const getScrapingStrategy = (url: string): ScrapingStrategy => {
  const foundStrategy = strategies.find((s) => url.includes(s.name));
  if (!foundStrategy) {
    throw new NotFoundError(`No strategy found for URL: ${url}`);
  }

  return foundStrategy.strategy;
};
