'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/data/services';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { pad2 } from '@/lib/utils';
import { SectionHeading } from '../ui/SectionHeading';

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="services-title"
          index="06"
          label="Services"
          title={['What I ', { text: 'do', serif: true }, '.']}
        />
      </div>
      <ul className="border-t border-line">
        {services.map((s, i) => (
          <motion.li
            key={s.title}
            tabIndex={0}
            data-activate="line"
            className="group relative isolate overflow-hidden border-b border-line outline-none focus-visible:outline-2 focus-visible:-outline-offset-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.05 }}
          >
            {/* Accent fill sweeping in from the left */}
            <span
              aria-hidden
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-accent transition-transform duration-700 ease-out-expo group-act:scale-x-100 group-focus-visible:scale-x-100"
            />
            <div className="container-x grid gap-4 py-7 transition-colors duration-500 group-act:text-accent-ink group-focus-visible:text-accent-ink md:grid-cols-12 md:items-center md:py-9">
              <span className="font-mono text-sm text-accent transition-colors duration-500 group-act:text-accent-ink group-focus-visible:text-accent-ink md:col-span-1">
                {pad2(i + 1)}
              </span>
              <h3 className="text-[clamp(1.6rem,4.2vw,3.6rem)] leading-[1] font-semibold tracking-[-0.04em] md:col-span-6">
                {s.title}
              </h3>
              <div className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-700 ease-out-expo md:col-span-4 md:grid-rows-[0fr] md:opacity-0 md:group-act:grid-rows-[1fr] md:group-act:opacity-100 md:group-focus-visible:grid-rows-[1fr] md:group-focus-visible:opacity-100">
                <div className="overflow-hidden">
                  <p className="text-[0.98rem] leading-relaxed text-fg/70 transition-colors duration-500 group-act:text-accent-ink/85 group-focus-visible:text-accent-ink/85">
                    {s.description}
                  </p>
                  <p className="mt-3 font-mono text-[11px] tracking-wide uppercase opacity-70">{s.tags.join(' · ')}</p>
                </div>
              </div>
              <ArrowUpRight
                aria-hidden
                className="hidden size-8 justify-self-end transition-transform duration-700 ease-out-expo group-act:rotate-45 md:col-span-1 md:block"
              />
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
