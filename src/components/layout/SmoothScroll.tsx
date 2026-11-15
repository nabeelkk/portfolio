'use client';

import Lenis from 'lenis';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { getGsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { getLenis, scrollToTarget, setLenis } from '@/lib/scroll';

/**
 * Lenis smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync.
 * Disabled for prefers-reduced-motion. Also handles in-page anchor links and
 * scroll restoration on route change.
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduce) return;
    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [reduce]);

  // In-page anchors (#id) scroll smoothly and keep the URL clean.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element).closest<HTMLAnchorElement>('a[href*="#"]');
      if (!a) return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      const el = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!el) return;
      e.preventDefault();
      scrollToTarget(el);
      history.replaceState(null, '', url.hash);
      // Move focus for keyboard and screen-reader users.
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // On route change: jump to top, or to the hash target if present.
  useEffect(() => {
    const hash = window.location.hash;
    const id = window.setTimeout(() => {
      const el = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (el) scrollToTarget(el, true);
      else if (getLenis()) scrollToTarget(0, true);
      getGsap().ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
