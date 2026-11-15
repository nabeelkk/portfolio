'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Fragment } from 'react';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { cn } from '@/lib/utils';

/**
 * A segment of a heading. Strings are plain text; `{ text, serif: true }` renders in
 * the italic serif; `{ text, accent: true }` adds the accent colour.
 */
export type Segment = string | { text: string; serif?: boolean; accent?: boolean; className?: string };

type Props = {
  segments: Segment[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  /** Split by words (default) or characters. */
  by?: 'word' | 'char';
  delay?: number;
  stagger?: number;
  /** Animate immediately on mount instead of on scroll into view. */
  immediate?: boolean;
  id?: string;
};

/** Masked, staggered text reveal. Accessible: the full text is exposed via aria-label. */
export function SplitText({
  segments,
  as = 'h2',
  className,
  by = 'word',
  delay = 0,
  stagger,
  immediate = false,
  id,
}: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  const label = segments.map((s) => (typeof s === 'string' ? s : s.text)).join('');
  const step = stagger ?? (by === 'char' ? 0.025 : 0.06);
  let index = 0;

  const unit = (text: string, key: string, cls?: string) => {
    const i = index++;
    return (
      <span key={key} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
        <motion.span
          className={cn('inline-block will-change-transform', cls)}
          variants={{
            hidden: reduce ? { opacity: 0, y: '0%' } : { y: '110%' },
            show: reduce
              ? { opacity: 1, y: '0%', transition: { duration: 0.4 } }
              : { y: '0%', transition: { duration: 0.9, ease: EASE_OUT, delay: delay + i * step } },
          }}
        >
          {text}
        </motion.span>
      </span>
    );
  };

  return (
    <Tag
      id={id}
      aria-label={label}
      className={className}
      initial="hidden"
      {...(immediate ? { animate: 'show' } : { whileInView: 'show', viewport: inViewOnce })}
    >
      <span aria-hidden>
        {segments.map((seg, si) => {
          const s = typeof seg === 'string' ? { text: seg } : seg;
          const cls = cn(s.serif && 'serif-i', s.accent && 'text-accent', s.className);
          const words = s.text.split(/(\s+)/);
          return (
            <Fragment key={si}>
              {words.map((w, wi) => {
                if (/^\s+$/.test(w)) return ' ';
                if (!w) return null;
                if (by === 'word') return unit(w, `${si}-${wi}`, cls);
                return (
                  <span key={`${si}-${wi}`} className="inline-block whitespace-nowrap">
                    {Array.from(w).map((c, ci) => unit(c, `${si}-${wi}-${ci}`, cls))}
                  </span>
                );
              })}
            </Fragment>
          );
        })}
      </span>
    </Tag>
  );
}
