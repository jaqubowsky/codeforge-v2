import SelectorBuilder from "../../builder/selector.builder";

export const SELECTORS = {
  listPage: () => {
    const base = new SelectorBuilder("div#up-offers-list");

    return {
      offersList: () => base,
      offerItem: () => base.child("li"),
      title: () => base.child("li h3"),
      company: () => base.child('[data-testid="ApartmentRoundedIcon"] + p'),
      salary: () => base.child("span.MuiTypography-lead3"),
      url: () => base.child("a.offer-card"),
    };
  },

  technologiesList: () => {
    const base = new SelectorBuilder('[data-testid="technologies-list"]');
    return {
      technologyItem: () => base.child("a"),
      technologyName: () => base.child("p.MuiTypography-body2"),
      technologyCount: () => base.child('[data-testid="total-offers-count"]'),
    };
  },

  offerPage: () => {
    const base = new SelectorBuilder("");

    return {
      description: () => base.child("h3:has-text('Job description') + div"),
      techStackItem: () =>
        base.child("h2:has-text('Tech stack') + div ul > div"),
      techStackName: () => base.child("h4"),
      techStackLevel: () => base.child("span.MuiTypography-subtitle4"),
    };
  },
};
