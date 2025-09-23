"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JustJoinItStrategy = void 0;
const just_join_it_offer_page_1 = require("../poms/just-join-it-offer-page");
const just_join_it_page_1 = require("../poms/just-join-it-page");
const batch_processor_1 = require("../utils/batch-processor");
const CONCURRENCY_LIMIT = 5;
class JustJoinItStrategy {
    async execute(page) {
        const justJoinItPage = new just_join_it_page_1.JustJoinItPage(page);
        await justJoinItPage.handleCookies();
        await justJoinItPage.scrollToEndOfList();
        const offers = await justJoinItPage.getOffers();
        const context = page.context();
        const processOffer = async (offer) => {
            const offerPageInstance = await context.newPage();
            try {
                await offerPageInstance.goto(offer.url);
                const offerPage = new just_join_it_offer_page_1.JustJoinItOfferPage(offerPageInstance);
                const description = await offerPage.getJobDescription();
                const skills = await offerPage.getTechStack();
                return {
                    ...offer,
                    description,
                    skills,
                };
            }
            finally {
                await offerPageInstance.close();
            }
        };
        const detailedOffers = await (0, batch_processor_1.executeInBatches)(offers, processOffer, CONCURRENCY_LIMIT);
        return detailedOffers;
    }
}
exports.JustJoinItStrategy = JustJoinItStrategy;
