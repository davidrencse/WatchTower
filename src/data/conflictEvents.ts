import type { GlobalEventStory } from './globalEventNews';
import { formatShortDate } from '../lib/numberFormat';

export type ConflictEvent = {
  id: string;
  title: string;
  publishedAt: string;
  source: 'LiveUAmap';
  sourceUrl: string;
  locationLabel: string;
  latitude: number;
  longitude: number;
};

export type ConflictEventsResponse = {
  events: ConflictEvent[];
  configured: boolean;
  updatedAt: string;
  warnings?: string[];
};

export const UKRAINE_MAP_SOURCES = [
  {
    label: 'Daily event map',
    provider: 'LiveUAmap',
    url: 'https://liveuamap.com/',
  },
  {
    label: 'Guerra Ruso-Ucraniana 2022',
    provider: 'Google My Maps',
    url: 'https://www.google.com/maps/d/u/0/viewer?mid=1V8NzjQkzMOhpuLhkktbiKgodOQ27X6IV&ll=48.16250503625539%2C35.80284720937499&z=7',
  },
  {
    label: 'Russian invasion control map',
    provider: 'Google My Maps',
    url: 'https://www.google.com/maps/d/u/0/viewer?hl=en&ll=48.620827531351445%2C37.21195744004266&z=7&mid=1thW9kqnDOaS2lAepLhLdzSX8Ur9Sc4k',
  },
  {
    label: 'Military Summary map',
    provider: 'Subscription',
    url: 'https://militarysummary.com/map',
  },
] as const;

export function conflictEventToStory(event: ConflictEvent): GlobalEventStory {
  const parsed = new Date(event.publishedAt);
  const published = Number.isNaN(parsed.getTime())
    ? 'Live'
    : formatShortDate(parsed);

  return {
    id: `liveuamap:${event.id}`,
    published,
    headline: event.title,
    source: event.source,
    url: event.sourceUrl,
    format: 'article',
    location: 'kyiv',
    pinpoint: {
      label: event.locationLabel,
      latitude: event.latitude,
      longitude: event.longitude,
    },
  };
}
