'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

/**
 * Touch devices have no hover, so hover-driven effects (scroll-on-hover screenshots,
 * image crossfades, shine sweeps, the services fill, skill spotlights…) would never play.
 * On touch screens this toggles `.is-active` on every `[data-activate]` element while it
 * sits in the middle band of the viewport; the `group-act:` variant styles that state
 * exactly like hover.
 */
export function TouchActivator() {
  const touch = useMediaQuery('(hover: none)');
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (!touch || reduce) return;
    const toggle: IntersectionObserverCallback = (entries) =>
      entries.forEach((e) => e.target.classList.toggle('is-active', e.isIntersecting));
    // Default: a centred band (30% in from top/bottom, 10% from the sides, so cards in
    // the horizontal project track activate as they slide into the middle).
    const band = new IntersectionObserver(toggle, { rootMargin: '-30% -10% -30% -10%' });
    // data-activate="line": a thin centre line, so only one stacked row is active at a time.
    const line = new IntersectionObserver(toggle, { rootMargin: '-49% 0px -49% 0px' });
    const seen = new WeakSet<Element>();
    const scan = () =>
      document.querySelectorAll('[data-activate]').forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        (el.getAttribute('data-activate') === 'line' ? line : band).observe(el);
      });
    scan();
    // Pick up elements added later (filters, route changes, lazy sections).
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      band.disconnect();
      line.disconnect();
      document.querySelectorAll('.is-active').forEach((el) => el.classList.remove('is-active'));
    };
  }, [touch, reduce, pathname]);

  return null;
}
