import { useMemo } from 'react';
import newsCsvRaw from '../../Assets/Data/countries/Germany/news.csv?raw';
import russiaNewsCsvRaw from '../../Assets/Data/countries/Russia/news.csv?raw';
import { useCsvText } from './useCsvText';
import { parseGermanyNewsCsv, type GermanyNewsItem } from '../lib/countries/germany/germanyNews';

function useBundledCountryNews(isGermany: boolean, isRussia: boolean): GermanyNewsItem[] {
  return useMemo(() => {
    if (isGermany) return parseGermanyNewsCsv(newsCsvRaw);
    if (isRussia) return parseGermanyNewsCsv(russiaNewsCsvRaw);
    return [];
  }, [isGermany, isRussia]);
}

export function useCountryNews(
  isGermany: boolean,
  csvUrl: string | null,
  isRussia = false,
): GermanyNewsItem[] {
  const bundled = useBundledCountryNews(isGermany, isRussia);
  const { text } = useCsvText(isGermany || isRussia ? '' : csvUrl ?? '');
  const fetched = useMemo(() => (text.trim() ? parseGermanyNewsCsv(text) : []), [text]);
  return isGermany || isRussia ? bundled : fetched;
}
