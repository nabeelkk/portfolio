'use client';

import { motion } from 'framer-motion';
import { skillGroups } from '@/data/skills';
import type { SkillGroup } from '@/data/types';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { cn, pad2 } from '@/lib/utils';
import { SectionHeading } from '../ui/SectionHeading';
import { TechIcon } from '../ui/TechIcon';

function Tile({ group, index }: { group: SkillGroup; index: number }) {
  const onMove = (e: React.PointerEvent<HTMLLIElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <motion.li
      onPointerMove={onMove}
      data-activate
      className={cn(
        'group relative isolate overflow-hidden rounded-2xl border border-line bg-card p-6 transition-colors duration-500 hover:border-line-strong md:p-7',
        group.span,
      )}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: (index % 3) * 0.08 }}
    >
      {/* Cursor spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-act:opacity-100"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(198,244,50,0.10), transparent 60%)',
        }}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-[-0.02em]">{group.title}</h3>
          <p className="mt-1 text-sm text-muted">{group.blurb}</p>
        </div>
        <span className="font-mono text-xs text-fg/30">{pad2(index + 1)}</span>
      </div>
      <ul className="mt-7 flex flex-wrap gap-x-2 gap-y-2.5">
        {group.items.map((item, i) => (
          <li
            key={item}
            className="inline-flex items-center gap-2 rounded-lg border border-line bg-bg/60 px-3 py-2 text-sm text-fg/80 transition-[transform,color,border-color] duration-500 ease-out-expo group-act:-translate-y-1 hover:border-accent/50 hover:text-accent"
            style={{ transitionDelay: `${i * 25}ms` }}
          >
            <TechIcon name={item} className="size-4" />
            {item}
          </li>
        ))}
      </ul>
    </motion.li>
  );
}

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="relative py-24 md:py-36">
      <div aria-hidden className="absolute inset-0 -z-10 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="container-x">
        <SectionHeading
          id="skills-title"
          index="05"
          label="Stack"
          title={['The ', { text: 'toolkit', serif: true }, ' behind the work.']}
          aside={<p className="text-fg/70">What I reach for across web, mobile, backend and infrastructure. No percentage bars, just tools I ship with.</p>}
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
          {skillGroups.map((g, i) => (
            <Tile key={g.id} group={g} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
