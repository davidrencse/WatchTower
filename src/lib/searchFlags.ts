import { getIso3ForFlagId } from './flagIsoMapping';
import type { FlagEntry } from '../types/flag';

const MAX_RESULTS = 8;

/** Case-insensitive match on country name and ISO3 code. */
export function searchFlags(flags: FlagEntry[], query: string): FlagEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const compact = q.replace(/\s+/g, '');
  const out: FlagEntry[] = [];

  for (const flag of flags) {
    const label = flag.label.toLowerCase();
    const iso = getIso3ForFlagId(flag.id)?.toLowerCase() ?? '';
    const labelCompact = label.replace(/\s+/g, '');

    const matches =
      label.includes(q) ||
      labelCompact.includes(compact) ||
      iso.includes(q) ||
      (q.length >= 2 && label.startsWith(q));

    if (matches) {
      out.push(flag);
      if (out.length >= MAX_RESULTS) break;
    }
  }

  return out;
}
