export const SELECTORS = {
  listPage: {
    base: "div#up-offers-list ul",
    children: {
      offerItem: "li[data-index]",
      offerItemChildren: {
        title: "h3.MuiTypography-root",
        company: '[data-testid="ApartmentRoundedIcon"] + p',
        salary: "span.MuiTypography-lead3",
        url: "a.offer-card",
      },
    },
  },

  technologiesList: {
    base: "div.MuiStack-root.mui-3ya0bv",
    children: {
      technologyItem: "a.offer_list_category_link",
      techItemChildren: {
        technologyName: "div.mui-d11uud span",
        technologyCount: "span.MuiBadge-badge",
      },
    },
  },

  offerPage: {
    children: {
      description: "h3.MuiTypography-overline + div.MuiBox-root",
      techStackContainer: "ul:has(> div)",
      techStackContainerChildren: {
        techStackItem: "ul:has(> div) > div",
        techStackItemChildren: {
          techStackName: "h4",
          techStackLevel: "span",
        },
      },
    },
  },
} as const;
