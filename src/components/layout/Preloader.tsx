'use client';

import { useEffect, useRef, useState } from 'react';

export const PRELOADER_KEY = 'nk-preloaded';

/**
 * Runs before paint (inlined in <head>): decides whether the preloader plays.
 * Skipped on repeat visits in the same session and for prefers-reduced-motion.
 */
export const preloaderInitScript = `(function(){var d=document.documentElement;try{if(matchMedia('(prefers-reduced-motion: reduce)').matches||sessionStorage.getItem('${PRELOADER_KEY}')){return}d.setAttribute('data-preloading','1')}catch(e){}})();`;

const NAME = 'NABEEL';

/** Counter 000→100, the name reveals letter by letter, then the panel slides up (~1.6s). */
export function Preloader() {
  const [gone, setGone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute('data-preloading')) {
      const id = window.setTimeout(() => setGone(true), 0);
      return () => window.clearTimeout(id);
    }
    const timers: number[] = [];
    let raf = 0;
    const start = performance.now();
    const COUNT_MS = 700;

    const step = (t: number) => {
      const p = Math.min(1, (t - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - p, 3);
      if (count.current) count.current.textContent = String(Math.round(eased * 100)).padStart(3, '0');
      if (p < 1) {
        raf = requestAnimationFrame(step);
        return;
      }
      panel.current?.classList.add('is-name');
      timers.push(
        window.setTimeout(() => {
          panel.current?.classList.add('is-out');
          root.removeAttribute('data-preloading'); // starts the hero intro
          try {
            sessionStorage.setItem(PRELOADER_KEY, '1');
          } catch {
            /* storage unavailable */
          }
          timers.push(window.setTimeout(() => setGone(true), 650));
        }, 320),
      );
    };
    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
      root.removeAttribute('data-preloading');
    };
  }, []);

  if (gone) return null;

  return (
    <div
      id="preloader"
      ref={panel}
      aria-hidden
      className="preloader fixed inset-0 z-[95] flex flex-col justify-between bg-bg p-[var(--gutter)]"
    >
      <div className="flex justify-between label-mono text-muted">
        <span>Muhammed Nabeel KK</span>
        <span>Portfolio ©{new Date().getFullYear()}</span>
      </div>
      <div className="flex items-end justify-between gap-6">
        <div className="flex overflow-hidden text-[clamp(3rem,14vw,12rem)] leading-[0.85] font-bold tracking-[-0.05em]">
          {NAME.split('').map((c, i) => (
            <span key={i} className="preloader-letter inline-block" style={{ transitionDelay: `${i * 40}ms` }}>
              {c}
            </span>
          ))}
        </div>
        <span ref={count} className="font-mono text-[clamp(1.5rem,4vw,3rem)] text-accent tabular-nums">
          000
        </span>
      </div>
    </div>
  );
}
