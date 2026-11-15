'use client';

import type Lenis from 'lenis';

/** Module-level handle to the active Lenis instance (null when smooth scroll is off). */
let lenis: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  lenis = l;
};
export const getLenis = () => lenis;

const NAV_OFFSET = -80;

/** Scrolls to an element/selector/position using Lenis when available. */
export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { offset: typeof target === 'number' ? 0 : NAV_OFFSET, immediate, duration: 1.4 });
    return;
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
    return;
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
    window.scrollTo({ top, behavior: immediate ? 'auto' : 'smooth' });
  }
}
