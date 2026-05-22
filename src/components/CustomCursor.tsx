import { useEffect } from 'react';
import { initCustomCursor } from '../lib/initCustomCursor';

/** Mount hook — returns cleanup so Strict Mode can re-init correctly. */
export function CustomCursor() {
  useEffect(() => initCustomCursor(), []);
  return null;
}
