'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { education } from '@/data/education';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { pad2 } from '@/lib/utils';
import { SectionHeading } from '../ui/SectionHeading';

export function Education() {
  return (
    <section id="education" aria-labelledby="education-title" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          id="education-title"
          index="07"
          label="Education"
          title={['Foundations & ', { text: 'training', serif: true }, '.']}
        />
        <ul className="grid gap-5 md:grid-cols-2">
          {education.map((e, i) => (
            <motion.li
              key={e.school}
              data-activate
              className="group relative overflow-hidden rounded-2xl border border-line bg-card p-7 transition-colors duration-500 hover:border-line-strong md:p-9"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.8, ease: EASE_OUT, delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between label-mono text-muted">
                <span className="text-accent">{pad2(i + 1)}</span>
                <span>{e.period}</span>
              </div>
              <GraduationCap aria-hidden className="mt-10 size-7 text-fg/40 transition-colors duration-500 group-act:text-accent" />
              <h3 className="mt-4 text-[clamp(1.5rem,2.6vw,2.1rem)] leading-tight font-semibold tracking-[-0.03em]">
                {e.degree}
              </h3>
              <p className="mt-1 serif-i text-xl text-fg/85">
                {e.school}
                {e.location ? `, ${e.location}` : ''}
              </p>
              <p className="mt-5 text-sm leading-relaxed text-fg/65">{e.notes}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
