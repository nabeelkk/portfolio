'use client';

import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import { moreProjects } from '@/data/projects';
import type { ProjectFilter } from '@/data/types';
import { EASE_OUT } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { TransitionLink } from '../layout/PageTransition';
import { ProjectLinks } from '../ui/ProjectLinks';
import { SectionHeading } from '../ui/SectionHeading';
import { SmartImage } from '../ui/SmartImage';
import { StatusBadge } from '../ui/Tag';
import type { MediaMap } from './FeaturedProjects';

const FILTERS: { id: 'all' | ProjectFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'clones', label: 'Clones' },
];

export function MoreProjects({ media }: { media: MediaMap }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const list = filter === 'all' ? moreProjects : moreProjects.filter((p) => p.filter === filter);

  return (
    <section id="more-work" aria-labelledby="more-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="more-title"
          index="04"
          label="More work"
          title={['More ', { text: 'experiments', serif: true }, ' & builds.']}
        />

        <LayoutGroup>
          <div role="group" aria-label="Filter projects" className="mb-10 flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const count = f.id === 'all' ? moreProjects.length : moreProjects.filter((p) => p.filter === f.id).length;
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  aria-pressed={active}
                  className={cn(
                    'relative rounded-full border px-4 py-2 text-sm transition-colors duration-300',
                    active ? 'border-accent text-accent-ink' : 'border-line-strong text-fg/75 hover:border-fg/50 hover:text-fg',
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-accent"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">
                    {f.label} <span className="font-mono text-[0.7em] opacity-70">{count}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
            <AnimatePresence mode="popLayout" initial={false}>
              {list.map((p) => {
                const m = media[p.slug];
                const image = (
                  <SmartImage
                    image={m?.cover}
                    fallback={{ name: p.name, stack: p.stack, category: p.category }}
                    className="object-top transition-transform duration-[900ms] ease-out-expo group-act:scale-[1.06]"
                  />
                );
                return (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                    data-activate
                    className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-card transition-[transform,border-color,box-shadow] duration-500 ease-out-expo hover:-translate-y-1.5 hover:border-line-strong hover:shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden border-b border-line">
                      {p.caseStudy ? (
                        <TransitionLink href={`/projects/${p.slug}/`} tabIndex={-1} aria-hidden data-cursor="VIEW" className="block h-full">
                          {image}
                        </TransitionLink>
                      ) : (
                        image
                      )}
                      <span className="shine" aria-hidden />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <StatusBadge status={p.status} />
                      </div>
                      {m?.cover?.concept && (
                        <span className="absolute bottom-3 left-3 rounded-full bg-bg/80 px-2.5 py-1 font-mono text-[10px] tracking-[0.12em] uppercase backdrop-blur-md">
                          Design concept
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-5">
                      <div>
                        <p className="label-mono text-accent">{p.category}</p>
                        <h3 className="mt-1.5 text-xl leading-tight font-semibold tracking-[-0.02em]">{p.name}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-fg/65">{p.tagline}</p>
                      </div>
                      <p className="font-mono text-[11px] leading-relaxed text-muted">{p.stack.join(' · ')}</p>
                      <ProjectLinks project={p} className="mt-auto" />
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        </LayoutGroup>
      </div>
    </section>
  );
}
