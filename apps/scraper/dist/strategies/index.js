"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScrapingStrategy = void 0;
const errors_1 = require("../utils/errors");
const just_join_it_strategy_1 = require("./just-join-it-strategy");
const strategies = [
    {
        name: "justjoin.it",
        strategy: new just_join_it_strategy_1.JustJoinItStrategy(),
    },
];
const getScrapingStrategy = (url) => {
    const foundStrategy = strategies.find((s) => url.includes(s.name));
    if (!foundStrategy) {
        throw new errors_1.NotFoundError(`No strategy found for URL: ${url}`);
    }
    return foundStrategy.strategy;
};
exports.getScrapingStrategy = getScrapingStrategy;
