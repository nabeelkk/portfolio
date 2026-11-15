'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { clientSites } from '@/data/projects';
import type { ProjectImage } from '@/data/types';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { cn, externalProps, hostname, pad2 } from '@/lib/utils';
import { BrowserFrame } from '../ui/BrowserFrame';
import { ScrollShot } from '../ui/ScrollShot';
import { SectionHeading } from '../ui/SectionHeading';
import { StatusBadge } from '../ui/Tag';

export type ClientMedia = Record<string, { cover: ProjectImage | null; full: ProjectImage | null }>;

export function ClientWebsites({ media }: { media: ClientMedia }) {
  return (
    <section id="clients" aria-labelledby="clients-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="clients-title"
          index="03.6"
          label="Client websites"
          title={['Live sites for ', { text: 'real', serif: true }, ' businesses.']}
          aside={<p className="text-fg/70">Built and shipped through AISYNX. Each preview scrolls through the live site.</p>}
        />
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {clientSites.map((s, i) => {
            const m = media[s.slug];
            const wide = i === 0;
            return (
              <motion.li
                key={s.slug}
                className={cn(wide && 'md:col-span-2')}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewOnce}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: (i % 2) * 0.08 }}
              >
                <a
                  href={s.url}
                  {...externalProps}
                  data-cursor="VISIT"
                  data-activate
                  aria-label={`Visit ${s.name} (opens in a new tab)`}
                  className="group block rounded-xl"
                >
                  <BrowserFrame url={hostname(s.url)} className="transition-[border-color,transform] duration-500 ease-out-expo group-act:-translate-y-1 group-act:border-fg/30">
                    <ScrollShot
                      full={m?.full ?? null}
                      cover={m?.cover ?? null}
                      name={s.name}
                      aspect={wide ? 9 / 21 : 10 / 16}
                      duration={wide ? 7 : 5}
                      className="bg-card"
                    />
                  </BrowserFrame>
                </a>
                <div className="mt-5 flex flex-col items-start gap-4 sm:flex-row sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="font-mono text-xs text-accent">{pad2(i + 1)}</span>
                      <h3 className="text-2xl font-semibold tracking-[-0.03em]">{s.name}</h3>
                      <StatusBadge status="live" />
                    </div>
                    <p className="mt-1 label-mono text-muted">{s.industry}</p>
                    <p className="mt-3 max-w-lg text-fg/70">{s.description}</p>
                  </div>
                  <a
                    href={s.url}
                    {...externalProps}
                    aria-label={`Visit ${s.name} website`}
                    className="group/v inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
                  >
                    Visit site
                    <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 group-hover/v:rotate-45" />
                  </a>
                </div>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
