'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { profile } from '@/data/profile';
import { EASE_IN_OUT, EASE_OUT, inViewOnce } from '@/lib/animations';
import { getGsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { asset } from '@/lib/utils';
import { Counter } from '../ui/Counter';
import { SectionHeading } from '../ui/SectionHeading';

/** Words go from muted to full colour as the paragraph scrolls through the viewport. */
function ScrubParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('[data-word]'),
        { opacity: 0.4 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <p
      ref={ref}
      className="text-[clamp(1.6rem,3.3vw,2.85rem)] leading-[1.12] font-medium tracking-[-0.03em]"
    >
      {text.split(' ').map((w, i) => (
        <span key={i} data-word className="inline-block">
          {w}&nbsp;
        </span>
      ))}
    </p>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 md:py-36">
      <div className="container-x">
        <SectionHeading
          id="about-title"
          index="01"
          label="About"
          title={['Engineer by craft, ', { text: 'founder', serif: true }, ' by choice.']}
        />

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Photo */}
          <div className="lg:col-span-5">
            <motion.figure
              className="group relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl border border-line-strong bg-card lg:sticky lg:top-28"
              initial={{ clipPath: 'inset(100% 0 0 0 round 16px)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0 round 16px)' }}
              viewport={inViewOnce}
              transition={{ duration: 1.3, ease: EASE_IN_OUT }}
            >
              <motion.div
                className="h-full w-full"
                initial={{ scale: 1.25 }}
                whileInView={{ scale: 1 }}
                viewport={inViewOnce}
                transition={{ duration: 1.6, ease: EASE_OUT }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset(profile.photo.src)}
                  alt="Portrait of Muhammed Nabeel KK"
                  width={profile.photo.width}
                  height={profile.photo.height}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[50%_30%] grayscale contrast-[1.05] transition-[filter] duration-700 group-act:grayscale-0 [@media(hover:none)]:grayscale-0"
                />
              </motion.div>
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent mix-blend-multiply" />
              <figcaption className="absolute inset-x-4 bottom-4 flex items-center justify-between label-mono text-fg/85">
                <span>{profile.name}</span>
                <span>{profile.aisynx.location}</span>
              </figcaption>
              {/* Rotating sticker */}
              <div aria-hidden className="absolute top-4 right-4 grid size-24 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 animate-spin-slow">
                  <defs>
                    <path id="sticker-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                  </defs>
                  <text className="fill-accent font-mono text-[9.5px] tracking-[3px] uppercase">
                    <textPath href="#sticker-circle">Full-stack · Founder · Builder ·</textPath>
                  </text>
                </svg>
                <span className="grid size-12 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-ink">
                  Hi 👋
                </span>
              </div>
            </motion.figure>
          </div>

          {/* Copy */}
          <div className="flex flex-col gap-12 lg:col-span-7">
            <ScrubParagraph text={profile.statement} />
            <motion.p
              className="max-w-2xl text-[length:var(--text-lead)] leading-relaxed text-fg/70"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.8, ease: EASE_OUT }}
            >
              {profile.summary}
            </motion.p>
            <p className="label-mono text-muted">
              <span className="text-accent">↳</span> {profile.openTo}
            </p>

            <dl className="grid grid-cols-2 border-t border-l border-line">
              {profile.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  className="flex flex-col gap-2 border-r border-b border-line p-5 md:p-7"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewOnce}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: i * 0.08 }}
                >
                  <dt className="order-2 label-mono text-muted">{s.label}</dt>
                  <dd className="order-1 text-[clamp(2.75rem,6vw,4.75rem)] leading-none font-semibold tracking-[-0.05em]">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
