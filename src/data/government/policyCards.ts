/**
 * Shape of the government → Policies carousel cards.
 *
 * One card per policy sector; each card lists the individual measures with what
 * changed, the detail, a status badge and a source. Germany and France both feed
 * `components/government/PolicyCarousel` with this shape.
 */

export type PolicyCardItem = {
  name: string;
  whatChanged: string;
  details: string;
  status: string;
  source: string;
};

export type PolicyInfographic = {
  sectorTitle: string;
  description: string;
  policies: PolicyCardItem[];
};
