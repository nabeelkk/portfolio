'use client';

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useFancyPointer } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * Custom cursor (fine pointers only, never with reduced motion): an accent dot plus a lagging
 * ring. Elements can set data-cursor="VIEW" | "DRAG" | "COPY" to show a labelled bubble.
 * It is purely decorative: pointer-events are off and native focus rings are untouched.
 */
export function Cursor() {
  const enabled = useFancyPointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });
  const [label, setLabel] = useState<string | null>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-custom-cursor');
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const c = t.closest<HTMLElement>('[data-cursor]');
      setLabel(c?.dataset.cursor ?? null);
      setHovering(!!t.closest('a, button, [role="button"], input, textarea, select, label'));
    };
    const leave = () => setVisible(false);
    const pd = () => setDown(true);
    const pu = () => setDown(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', pd);
    window.addEventListener('pointerup', pu);
    return () => {
      root.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', pd);
      window.removeEventListener('pointerup', pu);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      {/* Lagging ring / label bubble */}
      <motion.div
        className="absolute top-0 left-0"
        style={{ x: rx, y: ry, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className={cn(
            'flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full',
            label ? 'bg-accent text-accent-ink' : 'border border-fg mix-blend-difference',
          )}
          animate={{
            width: label ? 88 : hovering ? 56 : 34,
            height: label ? 88 : hovering ? 56 : 34,
            scale: down ? 0.85 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="font-mono text-[11px] font-semibold tracking-[0.18em]"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      {/* Dot */}
      <motion.div
        className="absolute top-0 left-0 mix-blend-difference"
        style={{ x, y, opacity: visible && !label ? 1 : 0 }}
      >
        <div className="size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
      </motion.div>
    </div>
  );
}
