'use client';

import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useFancyPointer, useReducedMotion } from '@/lib/hooks';
import { cn } from '@/lib/utils';

/**
 * 3D tilt (max `max` degrees). With a mouse it follows the pointer and adds a glare;
 * on touch screens it tilts with the card's position in the viewport while scrolling.
 */
export function TiltCard({
  children,
  className,
  max = 6,
  glare = true,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useFancyPointer();
  const reduce = useReducedMotion();
  const scrollTilt = !enabled && !reduce;
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const go = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 160, damping: 18 });
  const sry = useSpring(ry, { stiffness: 160, damping: 18 });
  const sgo = useSpring(go, { stiffness: 120, damping: 20 });
  const glareBg = useMotionTemplate`radial-gradient(600px circle at ${gx}% ${gy}%, rgba(255,255,255,0.12), transparent 45%)`;

  const onMove = (e: React.PointerEvent) => {
    if (!enabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * max);
    rx.set(-(py - 0.5) * 2 * max);
    gx.set(px * 100);
    gy.set(py * 100);
    go.set(1);
  };
  // Touch: tilt follows the card's offset from the viewport centre while it's on screen.
  useEffect(() => {
    const el = ref.current;
    if (!scrollTilt || !el) return;
    let raf = 0;
    let visible = false;
    const clamp = (v: number) => Math.max(-max, Math.min(max, v));
    const tick = () => {
      const r = el.getBoundingClientRect();
      const cx = (r.left + r.width / 2) / window.innerWidth - 0.5;
      const cy = (r.top + r.height / 2) / window.innerHeight - 0.5;
      ry.set(clamp(-cx * 2 * max));
      rx.set(clamp(cy * 1.6 * max));
      if (visible) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [scrollTilt, max, rx, ry]);

  const reset = () => {
    rx.set(0);
    ry.set(0);
    go.set(0);
  };

  return (
    <div className="[perspective:1400px]">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={enabled || scrollTilt ? { rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' } : undefined}
        className={cn('relative will-change-transform', className)}
      >
        {children}
        {glare && enabled && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-overlay"
            style={{ background: glareBg, opacity: sgo }}
          />
        )}
      </motion.div>
    </div>
  );
}
