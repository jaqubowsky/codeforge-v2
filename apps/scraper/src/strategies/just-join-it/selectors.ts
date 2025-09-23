export const SELECTORS = {
  listPage: {
    offersList: "#up-offers-list",
    offerItem: "li",
    title: "h3",
    company: '[data-testid="ApartmentRoundedIcon"] + p',
    salary: "span.MuiTypography-lead3",
    url: "a.offer-card",
  },
  offerPage: {
    description: "h3:has-text('Job description') + div",
    techStackItem: "h2:has-text('Tech stack') + div ul > div",
    techStackName: "h4",
    techStackLevel: "span.MuiTypography-subtitle4",
  },
};
