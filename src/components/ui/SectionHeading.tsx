'use client';

import { motion } from 'framer-motion';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { SplitText, type Segment } from './SplitText';

/** Numbered editorial heading: "01 — ABOUT" label, a hairline, and a split-reveal title. */
export function SectionHeading({
  index,
  label,
  title,
  id,
  className,
  aside,
}: {
  index: string;
  label: string;
  title: Segment[];
  id: string;
  className?: string;
  aside?: React.ReactNode;
}) {
  return (
    <header className={cn('mb-14 md:mb-20', className)}>
      <div className="mb-8 flex items-center gap-4">
        <span className="label-mono text-accent">
          {index} — {label}
        </span>
        <motion.span
          aria-hidden
          className="h-px flex-1 origin-left bg-line-strong"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={inViewOnce}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        />
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SplitText
          id={id}
          segments={title}
          className="max-w-4xl text-[length:var(--text-h2)] leading-[0.95] font-semibold tracking-[-0.035em]"
        />
        {aside && <div className="md:max-w-sm md:pb-2">{aside}</div>}
      </div>
    </header>
  );
}
