'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, ChevronDown, MapPin } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { experience } from '@/data/experience';
import type { Experience as Exp } from '@/data/types';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { getGsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { cn, externalProps, isFilled, pad2 } from '@/lib/utils';
import { SectionHeading } from '../ui/SectionHeading';
import { Tag } from '../ui/Tag';

const VISIBLE_BULLETS = 3;

function RoleCard({ item, index }: { item: Exp; index: number }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const left = index % 2 === 0;
  const extra = item.bullets.length - VISIBLE_BULLETS;
  const bullets = open ? item.bullets : item.bullets.slice(0, VISIBLE_BULLETS);

  return (
    <li data-activate className="group relative grid grid-cols-[minmax(0,1fr)] md:grid-cols-2 md:gap-16">
      {/* Timeline dot */}
      <span
        aria-hidden
        className="absolute top-8 left-[11px] z-10 grid size-[18px] -translate-x-1/2 place-items-center md:left-1/2"
      >
        <span className="absolute inset-0 rounded-full bg-accent/30 opacity-0 transition-opacity duration-300 group-act:animate-ping-slow group-act:opacity-100" />
        <span className="size-[10px] rounded-full border-2 border-accent bg-bg transition-colors duration-300 group-act:bg-accent" />
      </span>

      <motion.article
        className={cn(
          'relative ml-10 min-w-0 rounded-2xl border border-line bg-card/80 p-5 backdrop-blur-sm sm:p-6 transition-[transform,border-color,box-shadow] duration-500 ease-out-expo group-act:-translate-y-1 group-act:border-accent/50 group-act:shadow-[0_0_0_1px_rgba(198,244,50,0.15),0_20px_60px_-25px_rgba(198,244,50,0.35)] md:ml-0 md:p-8',
          left ? 'md:col-start-1' : 'md:col-start-2',
        )}
        initial={{ opacity: 0, x: left ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={inViewOnce}
        transition={{ duration: 0.9, ease: EASE_OUT }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 label-mono text-muted">
          <span className="text-accent">{pad2(index + 1)}</span>
          {isFilled(item.period) && (
            <span className="inline-flex items-center gap-2">
              {item.current && <span className="size-1.5 rounded-full bg-live" aria-hidden />}
              {item.period}
            </span>
          )}
        </div>
        <h3 className="mt-4 text-[clamp(1.4rem,2.4vw,1.9rem)] leading-tight font-semibold tracking-[-0.03em]">
          {item.role}
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-fg/80">
          {item.url ? (
            <a href={item.url} {...externalProps} className="link-underline inline-flex items-center gap-1 serif-i text-xl text-fg">
              {item.company}
              <ArrowUpRight aria-hidden className="size-4" />
            </a>
          ) : (
            <span className="serif-i text-xl text-fg">{item.company}</span>
          )}
          <span className="inline-flex items-center gap-1 text-sm text-muted">
            <MapPin aria-hidden className="size-3.5" />
            {item.location}
          </span>
        </p>

        <ul id={listId} className="mt-5 flex flex-col gap-2.5 text-[0.95rem] leading-relaxed text-fg/75">
          <AnimatePresence initial={false}>
            {bullets.map((b, i) => (
              <motion.li
                key={b}
                className="flex gap-3"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: i >= VISIBLE_BULLETS ? (i - VISIBLE_BULLETS) * 0.04 : 0 }}
              >
                <span aria-hidden className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
                <span>{b}</span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {extra > 0 && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls={listId}
            className="mt-4 inline-flex items-center gap-1.5 label-mono text-accent hover:text-fg"
          >
            {open ? 'Show less' : `Show ${extra} more`}
            <ChevronDown aria-hidden className={cn('size-3.5 transition-transform duration-300', open && 'rotate-180')} />
          </button>
        )}

        <div className="mt-6 flex flex-wrap gap-1.5">
          {item.stack.map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
        </div>
      </motion.article>
    </li>
  );
}

export function Experience() {
  const wrap = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!wrap.current || !line.current || reduce) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: wrap.current, start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
        },
      );
    });
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative py-24 md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-30" />
      <div className="container-x">
        <SectionHeading
          id="experience-title"
          index="02"
          label="Experience"
          title={['Where I’ve ', { text: 'built', serif: true }, ' things.']}
          aside={
            <p className="text-fg/70">
              From front-end lead on ERP and CRM products to founding a studio that ships ERPs, SaaS and
              live client websites.
            </p>
          }
        />
        <div ref={wrap} className="relative">
          <div aria-hidden className="absolute top-0 bottom-0 left-[11px] w-px bg-line md:left-1/2" />
          <div
            ref={line}
            aria-hidden
            className="absolute top-0 bottom-0 left-[11px] w-px origin-top bg-gradient-to-b from-accent via-accent to-accent/0 md:left-1/2"
          />
          <ol className="flex flex-col gap-10 md:gap-6">
            {experience.map((e, i) => (
              <RoleCard key={e.company + e.role} item={e} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
