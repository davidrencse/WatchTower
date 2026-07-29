const SIZE = 40;
const HOTSPOT = SIZE / 2;
const CHEVRON_PX = 22;
const WHEEL_IDLE_MS = 360;
const HTML_CLASS = 'wt-custom-cursor';
const ROOT_ID = 'wt-custom-cursor-root';

type CursorMode = 'default' | 'down' | 'up' | 'globe';

const CHEVRON_STROKE = 'stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"';

let teardown: (() => void) | null = null;

function canUseCustomCursor(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(hover: none)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Vanilla cursor overlay — one paint per frame, no React on the hot path. */
export function initCustomCursor(): () => void {
  if (!canUseCustomCursor()) return () => {};

  if (teardown) {
    teardown();
    teardown = null;
  }

  document.documentElement.classList.add(HTML_CLASS);

  const root = document.createElement('div');
  root.id = ROOT_ID;
  root.setAttribute('aria-hidden', 'true');
  root.dataset.mode = 'default';
  Object.assign(root.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: `${SIZE}px`,
    height: `${SIZE}px`,
    pointerEvents: 'none',
    zIndex: '2147483647',
    opacity: '0',
    contain: 'layout style',
    transform: 'translate3d(-9999px,-9999px,0)',
  });

  root.innerHTML = `
    <div class="wt-cursor-default" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
      <svg width="${SIZE}" height="${SIZE}" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="9" stroke="currentColor" stroke-opacity="0.32" stroke-width="1"/>
        <circle cx="16" cy="16" r="2.75" fill="currentColor"/>
      </svg>
    </div>
    <div class="wt-cursor-scroll" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center">
      <svg class="wt-cursor-chevron-down" width="${CHEVRON_PX}" height="${CHEVRON_PX}" viewBox="0 0 24 24" ${CHEVRON_STROKE} aria-hidden="true">
        <path d="m6 9 6 6 6-6"/>
      </svg>
      <svg class="wt-cursor-chevron-up" width="${CHEVRON_PX}" height="${CHEVRON_PX}" viewBox="0 0 24 24" ${CHEVRON_STROKE} aria-hidden="true">
        <path d="m18 15-6-6-6 6"/>
      </svg>
    </div>
    <div class='wt-cursor-globe' style='position:absolute;left:50%;top:50%;width:64px;height:64px;transform:translate(-50%,-50%)'>
      <span class='wt-cursor-globe-axis wt-cursor-globe-axis-x'></span>
      <span class='wt-cursor-globe-axis wt-cursor-globe-axis-y'></span>
      <svg width='64' height='64' viewBox='0 0 64 64' fill='none' aria-hidden='true'>
        <g stroke='currentColor' stroke-width='1' shape-rendering='crispEdges'>
          <path d='M20.5 20V44M26.5 20V44M38.5 20V44M44.5 20V44M20 20.5H44M20 26.5H44M20 38.5H44M20 44.5H44' opacity='.14'/>
          <path d='M.5 32H27.5M36.5 32H63.5M32 .5V27.5M32 36.5V63.5' opacity='.72'/>
          <path d='M8.5 29V35M16.5 29V35M47.5 29V35M55.5 29V35M29 8.5H35M29 16.5H35M29 47.5H35M29 55.5H35' opacity='.38'/>
          <path d='M20.5 25V20.5H25M39 20.5H44.5V25M44.5 39V44.5H39M25 44.5H20.5V39' opacity='.5'/>
        </g>
        <rect x='30.5' y='30.5' width='3' height='3' fill='currentColor'/>
      </svg>
    </div>
  `;

  document.body.appendChild(root);

  let mx = -9999;
  let my = -9999;
  let mode: CursorMode = 'default';
  let overGlobe = false;
  let rafId = 0;
  let wheelIdle: ReturnType<typeof setTimeout> | null = null;

  const paint = () => {
    rafId = 0;
    root.style.transform = `translate3d(${mx - HOTSPOT}px,${my - HOTSPOT}px,0)`;
  };

  const schedulePaint = () => {
    if (rafId) return;
    rafId = requestAnimationFrame(paint);
  };

  const setMode = (next: CursorMode) => {
    if (mode === next) return;
    mode = next;
    root.dataset.mode = next;
  };

  const onMove = (clientX: number, clientY: number) => {
    mx = clientX;
    my = clientY;
    if (root.style.opacity !== '1') root.style.opacity = '1';
    schedulePaint();
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === 'touch') return;
    overGlobe = e.target instanceof Element && Boolean(e.target.closest('[data-globe]'));
    if (overGlobe) setMode('globe');
    else if (mode === 'globe') setMode('default');
    onMove(e.clientX, e.clientY);
  };

  const hide = () => {
    root.style.opacity = '0';
  };

  const onWheel = (e: WheelEvent) => {
    if (e.target instanceof Element && e.target.closest('[data-globe]')) {
      overGlobe = true;
      setMode('globe');
      if (wheelIdle) {
        clearTimeout(wheelIdle);
        wheelIdle = null;
      }
      return;
    }
    if (Math.abs(e.deltaY) < 0.5) return;
    setMode(e.deltaY > 0 ? 'down' : 'up');
    if (wheelIdle) clearTimeout(wheelIdle);
    wheelIdle = setTimeout(() => {
      wheelIdle = null;
      setMode('default');
    }, WHEEL_IDLE_MS);
  };

  const onPointerDown = () => {
    setMode(overGlobe ? 'globe' : 'default');
    if (wheelIdle) {
      clearTimeout(wheelIdle);
      wheelIdle = null;
    }
  };

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', hide);
  window.addEventListener('blur', hide, { passive: true });
  window.addEventListener('wheel', onWheel, { passive: true });
  window.addEventListener('pointerdown', onPointerDown, { passive: true });

  const cleanup = () => {
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('mouseleave', hide);
    window.removeEventListener('blur', hide);
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('pointerdown', onPointerDown);
    if (wheelIdle) clearTimeout(wheelIdle);
    if (rafId) cancelAnimationFrame(rafId);
    root.remove();
    document.documentElement.classList.remove(HTML_CLASS);
    teardown = null;
  };

  teardown = cleanup;
  return cleanup;
}
