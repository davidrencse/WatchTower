import type { Map } from 'maplibre-gl';

import { GERMANY_MASS_SHOOTING_META } from '../data/germanyMassShootingMeta';
import { TRADE_COMMODITY_META } from '../data/maritimeTradeRoutes';
import { STRATEGIC_RADAR_MISSION_META } from '../data/strategicRadarStations';
import { WAR_SIDE_META } from '../data/warOrderOfBattle';

/**
 * The standing thematic overlays the globe puts behind a switch, and the machinery to apply
 * that switch to MapLibre.
 *
 * These groups are singled out because they are standing overlays inside their zoom bands rather
 * than transient answers to a hover. Trade, war, radar and the Germany incident record can each
 * materially change the map's reading, so each gets an explicit switch and legend.
 */

export type GlobeLayerGroupId = 'trade' | 'war' | 'radar' | 'crime';

export interface GlobeLayerGroup {
  id: GlobeLayerGroupId;
  label: string;
  /** One line on what switching it off removes. */
  detail: string;
  /** Colour key rows shown under the label while the group is on. */
  keys: readonly { label: string; color: string }[];
  /** Optional methodology shown with datasets whose map marks need interpretation. */
  note?: string;
  /** Keyboard-accessible companion record for point datasets. */
  sourceUrl?: string;
  /**
   * Every MapLibre layer in the group. Ids that are not registered are skipped at apply time,
   * so this list can name a layer the style has not built yet.
   */
  layerIds: readonly string[];
}

export const GLOBE_LAYER_GROUPS: readonly GlobeLayerGroup[] = [
  {
    id: 'trade',
    label: 'Sea trade routes',
    detail: 'Lanes, chokepoints and ports',
    keys: [
      { label: TRADE_COMMODITY_META.container.label, color: TRADE_COMMODITY_META.container.color },
      { label: TRADE_COMMODITY_META.energy.label, color: TRADE_COMMODITY_META.energy.color },
      { label: TRADE_COMMODITY_META.bulk.label, color: TRADE_COMMODITY_META.bulk.color },
    ],
    layerIds: [
      'wt-trade-casing',
      'wt-trade-lanes',
      'wt-trade-hit',
      'wt-trade-ports',
      'wt-trade-chokepoints',
      'wt-trade-chokepoint-labels',
    ],
  },
  {
    id: 'radar',
    label: 'Strategic radar',
    detail: '13 acknowledged fixed sites',
    keys: Object.values(STRATEGIC_RADAR_MISSION_META),
    layerIds: ['wt-strategic-radars', 'wt-strategic-radar-labels'],
  },
  {
    id: 'crime',
    label: 'Germany mass shootings',
    detail: '60 sourced incidents · 2008–2026',
    note:
      'Definition: firearm incidents with at least 4 total casualties. Deaths may include the perpetrator; points are city or area centroids. Researched 17 Aug 2026.',
    sourceUrl: 'https://en.wikipedia.org/wiki/List_of_mass_shootings_in_Germany',
    keys: [GERMANY_MASS_SHOOTING_META.fatal, GERMANY_MASS_SHOOTING_META.nonfatal],
    layerIds: [
      'wt-germany-mass-shootings-halo',
      'wt-germany-mass-shootings',
      'wt-germany-mass-shooting-labels',
    ],
  },
  {
    id: 'war',
    label: 'Russo-Ukrainian war',
    detail: 'Control, frontline, order of battle',
    keys: [
      { label: WAR_SIDE_META.UKR.label, color: WAR_SIDE_META.UKR.color },
      { label: WAR_SIDE_META.RUS.label, color: WAR_SIDE_META.RUS.color },
    ],
    layerIds: [
      'wt-war-zone-fill',
      'wt-war-zone-edge',
      'wt-war-contested-fill',
      'wt-war-contested-edge',
      'wt-war-frontline-glow',
      'wt-war-frontline',
      'wt-war-settlement-labels',
      'wt-war-events-pulse',
      'wt-war-events',
      'wt-oob-lines-casing',
      'wt-oob-lines',
      'wt-oob-lines-hit',
      'wt-oob-sites',
      'wt-oob-formations',
      'wt-oob-formation-labels',
      'wt-oob-garrisons',
      'wt-oob-garrison-labels',
    ],
  },
];

/**
 * Flip `visibility` on every layer of each switched group.
 *
 * Layers the style has not built yet are skipped, so this is safe to call from inside
 * `installOverlays` as well as from the effect that watches the switches. Hiding a layer also
 * removes it from `queryRenderedFeatures`, so the hover and click handlers need no equivalent
 * branch — a hidden overlay stops answering the pointer on its own.
 */
export function applyLayerGroups(map: Map, enabled: Record<GlobeLayerGroupId, boolean>) {
  for (const group of GLOBE_LAYER_GROUPS) {
    const visibility = enabled[group.id] ? 'visible' : 'none';
    for (const id of group.layerIds) {
      if (!map.getLayer(id)) continue;
      // `visibility` is unset by default, which means visible — normalise before comparing so a
      // no-op does not invalidate the style on every styledata pass.
      if ((map.getLayoutProperty(id, 'visibility') ?? 'visible') === visibility) continue;
      map.setLayoutProperty(id, 'visibility', visibility);
    }
  }
}
