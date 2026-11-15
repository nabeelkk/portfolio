'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useMediaQuery, useReducedMotion } from '@/lib/hooks';

const HeroScene = dynamic(() => import('../three/HeroScene'), { ssr: false });

/**
 * Gradient-mesh backdrop plus the R3F particle scene on every device (lighter on small
 * screens). The scene loads after the page is idle so it never competes with first paint.
 * Only prefers-reduced-motion keeps it off.
 */
export function HeroBackground() {
  const reduce = useReducedMotion();
  const compact = useMediaQuery('(max-width: 767px)');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let id: number;
    if (w.requestIdleCallback) {
      id = w.requestIdleCallback(() => setReady(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    id = window.setTimeout(() => setReady(true), 1200);
    return () => window.clearTimeout(id);
  }, [reduce]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Gradient mesh fallback (always present, sits under the canvas) */}
      <div className="absolute top-[12%] right-[-10%] size-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(198,244,50,0.16),transparent_60%)] blur-2xl md:right-[-5%] md:size-[48vmax]" />
      <div className="absolute bottom-[-20%] left-[-15%] size-[55vmax] rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.14),transparent_60%)] blur-2xl" />
      <div className="absolute inset-0 grid-lines opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      {ready && (
        <div className="absolute inset-0 animate-[intro-fade_2s_ease-out_both] [mask-image:radial-gradient(ellipse_at_60%_35%,black_25%,transparent_72%)] md:[mask-image:radial-gradient(ellipse_at_70%_50%,black_30%,transparent_75%)]">
          <HeroScene compact={compact} />
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
