'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { profile } from '@/data/profile';
import { studioClients, studioProcess, studioServices } from '@/data/services';
import type { ProjectImage } from '@/data/types';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { getGsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { asset, pad2 } from '@/lib/utils';
import { BrowserFrame } from '../ui/BrowserFrame';
import { ButtonLink } from '../ui/Button';
import { Marquee } from '../ui/Marquee';

function ProcessStepper() {
  const wrap = useRef<HTMLOListElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const steps = el.querySelectorAll<HTMLElement>('[data-step]');
    if (reduce) {
      steps.forEach((s) => s.classList.add('is-active'));
      return;
    }
    const { gsap } = getGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        fill.current,
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.5,
            onUpdate: (self) => {
              const n = Math.round(self.progress * (steps.length - 1) + 0.49);
              steps.forEach((s, i) => s.classList.toggle('is-active', i < n || (i === 0 && self.progress > 0)));
            },
          },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <ol ref={wrap} className="relative grid gap-6 md:grid-cols-5 md:gap-4" aria-label="Engineering process">
      <div aria-hidden className="absolute top-[15px] bottom-0 left-[15px] w-px bg-line md:top-[15px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full" />
      <div
        ref={fill}
        aria-hidden
        className="absolute top-[15px] bottom-0 left-[15px] w-px origin-top bg-accent md:top-[15px] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full md:origin-left"
      />
      {studioProcess.map((s, i) => (
        <li key={s.step} data-step className="process-step group relative flex gap-4 md:flex-col md:gap-5">
          <span className="relative z-10 grid size-[31px] shrink-0 place-items-center rounded-full border border-line-strong bg-bg font-mono text-[11px] text-muted transition-colors duration-500 group-[.is-active]:border-accent group-[.is-active]:bg-accent group-[.is-active]:text-accent-ink">
            {pad2(i + 1)}
          </span>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-fg/50 transition-colors duration-500 group-[.is-active]:text-fg">
              {s.step}
            </h3>
            <p className="mt-1 text-sm text-muted">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Studio({ shot }: { shot: { full: ProjectImage | null; cover: ProjectImage | null } }) {
  const full = shot.full;
  const ratio = full ? full.height / full.width : 0;
  const travel = full ? Math.max(0, (1 - 0.625 / ratio) * 100) : 0;
  const image = full ?? shot.cover;

  return (
    <section id="studio" aria-labelledby="studio-title" className="relative overflow-hidden py-24 md:py-36">
      <div aria-hidden className="absolute top-0 left-1/2 -z-10 size-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,92,255,0.12),transparent_60%)]" />
      <div className="container-x">
        <div className="mb-8 flex items-center gap-4">
          <span className="label-mono text-accent">03.5 — The studio</span>
          <span aria-hidden className="h-px flex-1 bg-line-strong" />
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="flex flex-col gap-8 lg:col-span-5">
            <div className="flex items-center gap-4">
              <span className="grid size-16 place-items-center rounded-2xl border border-line-strong bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(profile.aisynx.logo)} alt="AISYNX logo" width={40} height={40} className="size-10 object-contain" loading="lazy" />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-[0.12em]">AISYNX</p>
                <p className="label-mono text-muted">
                  Founded {profile.aisynx.founded} · {profile.aisynx.location}
                </p>
              </div>
            </div>
            <motion.h2
              id="studio-title"
              className="text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.04em]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.9, ease: EASE_OUT }}
            >
              Engineering the <span className="serif-i text-accent">Future</span> of Software.
            </motion.h2>
            <p className="text-[length:var(--text-lead)] leading-relaxed text-fg/75">
              I designed, built and run AISYNX, a software studio building ERP solutions, custom software, SaaS
              platforms and mobile apps for SMEs and founders.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Service areas">
              {studioServices.map((s, i) => (
                <motion.li
                  key={s}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={inViewOnce}
                  transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 + i * 0.06 }}
                  className="rounded-full border border-line-strong px-3.5 py-1.5 text-sm text-fg/85 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink"
                >
                  {s}
                </motion.li>
              ))}
            </ul>
            <div>
              <ButtonLink href={profile.aisynx.url} external magnetic size="lg">
                Visit aisynx.in
              </ButtonLink>
            </div>
          </div>

          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewOnce}
            transition={{ duration: 1.1, ease: EASE_OUT }}
          >
            <a
              href={profile.aisynx.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit aisynx.in (opens in a new tab)"
              data-cursor="VISIT"
              data-activate
              className="group block rounded-xl"
            >
              <BrowserFrame url="aisynx.in" bodyClassName="aspect-[16/10] bg-card">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset(image.src)}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full object-cover object-top transition-transform ease-in-out [transition-duration:6s] group-act:[transform:translateY(var(--travel))] group-focus-visible:[transform:translateY(var(--travel))] motion-reduce:transition-none"
                    style={{ ['--travel' as string]: `-${travel.toFixed(2)}%` }}
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-card">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(profile.aisynx.logo)} alt="" width={120} height={120} className="size-28 opacity-80" />
                  </div>
                )}
              </BrowserFrame>
            </a>
            <p className="mt-3 label-mono text-muted">
              <span className="[@media(hover:none)]:hidden">Hover to scroll the live site ↓</span>
              <span className="hidden [@media(hover:none)]:inline">Live preview of aisynx.in ↓</span>
            </p>
          </motion.div>
        </div>

        <div className="mt-20 md:mt-28">
          <p className="mb-8 label-mono text-muted">How we work · 5 stages</p>
          <ProcessStepper />
        </div>
      </div>

      <div className="mt-20 border-y border-line py-7 md:mt-28">
        <p className="container-x mb-5 label-mono text-muted">Clients &amp; brands</p>
        <Marquee duration={36} label="Clients">
          {studioClients.map((c) => (
            <span
              key={c}
              className="mx-8 text-[clamp(1.4rem,3vw,2.4rem)] font-semibold tracking-[0.08em] whitespace-nowrap text-fg/55 transition-colors duration-300 hover:text-fg md:mx-12"
            >
              {c}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
