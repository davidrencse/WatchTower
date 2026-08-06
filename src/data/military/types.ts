/**
 * Shape of a hand-curated national military profile.
 *
 * Countries with a curated profile (see `./index.ts`) render through
 * `components/military/NationalMilitarySection`; every other country falls back
 * to the generic GlobalFirePower-driven `CountryMilitarySection`. Keeping the
 * profile as data means adding a country is a new file here, not a new
 * component.
 */

export type IconKind =
  | 'tank'
  | 'afv'
  | 'artillery'
  | 'mlrs'
  | 'jet'
  | 'heli'
  | 'ship'
  | 'sub'
  | 'cyber'
  | 'nuclear'
  | 'shield';

export type EquipItem = {
  key: string;
  name: string;
  /** Representative in-service platform(s) for the category. */
  platform: string;
  total: number;
  /** GlobalFirePower estimated readiness count, where published. */
  ready?: number;
  image?: string;
  icon: IconKind;
  /** Broad support/transport category (e.g. GFP "armored vehicles") — excluded from fleet-share. */
  support?: boolean;
};

export type Branch = {
  id: string;
  title: string;
  accent: string;
  headline: string;
  blurb: string;
  items: EquipItem[];
  /** Hide share-of-fleet meters when published role categories overlap. */
  showShare?: boolean;
};

/** A non-equipment force component (cyber command, nuclear deterrent, gendarmerie…). */
export type MilitaryPanel = {
  id: string;
  /** Collapsible section title, e.g. "Cyberspace". */
  title: string;
  accent: string;
  icon: IconKind;
  headline: string;
  blurb: string;
  stats: readonly { label: string; value: string; sub?: string }[];
  listTitle: string;
  items: readonly { name: string; note: string }[];
  footnote: string;
};

export type OverviewStat = {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
};

export type MilitarySource = { label: string; url: string };

export type MilitaryProfile = {
  iso3: string;
  countryName: string;
  overview: readonly OverviewStat[];
  branches: readonly Branch[];
  panels: readonly MilitaryPanel[];
  sources: readonly MilitarySource[];
  /** Closing note under the section — provenance of counts and photographs. */
  footnote: string;
  /** Per-branch note under each equipment grid. */
  branchFootnote: string;
};

export const ARMY_ACCENT = '#8aa35b';
export const NAVY_ACCENT = '#4f8ff0';
export const AIR_ACCENT = '#38bdf8';
export const CYBER_ACCENT = '#a78bfa';
export const NUCLEAR_ACCENT = '#fbbf24';
export const GENDARMERIE_ACCENT = '#f87171';
