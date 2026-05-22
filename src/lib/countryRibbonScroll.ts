/** Instant in-page scroll for country ribbon anchors (sticky header + ribbon margin). */
export function scrollToCountryAnchor(anchorId: string): void {
  const el = document.getElementById(anchorId);
  if (!el) return;

  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 112;
  const top = el.getBoundingClientRect().top + window.scrollY - margin;
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' });
}
