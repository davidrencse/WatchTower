/**
 * Layered "perfect dark shadow" stack used across the Countries page.
 * The six layers stack from a 1px hairline outline to a 150px ambient drop
 * so the panel reads as a heavy, dimensional surface lifted above the stage.
 */
export const PERFECT_DARK_SHADOW = [
  '0px 0px 0px 1px rgba(165, 165, 165, 0.04)',
  '-9px 9px 9px -0.5px rgba(0, 0, 0, 0.04)',
  '-18px 18px 18px -1.5px rgba(0, 0, 0, 0.08)',
  '-37px 37px 37px -3px rgba(0, 0, 0, 0.16)',
  '-75px 75px 75px -6px rgba(0, 0, 0, 0.24)',
  '-150px 150px 150px -12px rgba(0, 0, 0, 0.48)',
].join(', ');

/** Slightly tighter variant for the smaller rail cards so neighboring shadows don't pile up. */
export const PERFECT_DARK_SHADOW_COMPACT = [
  '0px 0px 0px 1px rgba(165, 165, 165, 0.04)',
  '-6px 6px 6px -0.5px rgba(0, 0, 0, 0.06)',
  '-12px 12px 14px -1.5px rgba(0, 0, 0, 0.12)',
  '-24px 24px 28px -3px rgba(0, 0, 0, 0.22)',
  '-48px 48px 60px -6px rgba(0, 0, 0, 0.34)',
].join(', ');
