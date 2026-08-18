/**
 * Pre-paint theme resolution + deferred webfont swap.
 *
 * This lives in its own file rather than inline in `index.html` so the Content-Security-Policy
 * can use `script-src 'self'` with no `'unsafe-inline'`. It must stay render-blocking (a plain
 * `<script src>` in <head>, no defer/async) — the whole point is that `data-theme` is on the
 * root element before the first paint, or the page flashes the wrong theme.
 */
(() => {
  const storageKey = 'wt-theme';
  const root = document.documentElement;
  let theme = null;

  try {
    theme = localStorage.getItem(storageKey);
  } catch {
    theme = null;
  }

  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  root.setAttribute('data-theme', theme);

  // Non-render-blocking webfonts: the stylesheet is fetched at `media="print"`, then promoted
  // to `all` once it lands. That promotion used to be an inline `onload=` attribute, which no
  // CSP short of 'unsafe-inline' allows. Capture-phase delegation does the same job from here —
  // `load` does not bubble, hence the `true`. This runs before the <link> is parsed, so the
  // listener is always installed in time.
  document.addEventListener(
    'load',
    (event) => {
      const target = event.target;
      if (target instanceof HTMLLinkElement && target.dataset.swapMedia) {
        target.media = target.dataset.swapMedia;
      }
    },
    true,
  );
})();
