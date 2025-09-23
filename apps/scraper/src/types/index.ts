export type Offer = {
  title: string;
  company: string;
  salary: string;
  url: string;
  description: string;
  skills: Skill[];
};

export type OfferWithoutDescriptionAndSkills = Pick<
  Offer,
  "title" | "company" | "salary" | "url"
>;

export type Skill = {
  name: string;
  level: string;
};
