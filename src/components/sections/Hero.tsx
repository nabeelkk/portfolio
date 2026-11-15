'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { profile, socials } from '@/data/profile';
import { EASE_OUT } from '@/lib/animations';
import { useReducedMotion } from '@/lib/hooks';
import { asset, cn, externalProps } from '@/lib/utils';
import { ButtonLink, IconLink } from '../ui/Button';
import { SocialIcon } from '../ui/SocialIcon';
import { HeroBackground } from './HeroBackground';

function RotatingWords({ words }: { words: readonly string[] }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => window.clearInterval(id);
  }, [words.length]);
  return (
    <span className="relative inline-grid overflow-hidden align-bottom text-accent">
      {/* Reserve the width of the longest word so the line never jumps */}
      <span aria-hidden className="invisible [grid-area:1/1]">
        {words.reduce((a, b) => (b.length > a.length ? b : a))}
      </span>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={words[i]}
          className="serif-i [grid-area:1/1] whitespace-nowrap"
          initial={reduce ? { opacity: 0 } : { y: '100%' }}
          animate={reduce ? { opacity: 1 } : { y: '0%' }}
          exit={reduce ? { opacity: 0 } : { y: '-100%' }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function NameLine({ text, outline, delay }: { text: string; outline?: boolean; delay: number }) {
  return (
    <span className={cn('flex', outline && 'stroke-line')}>
      {text.split('').map((c, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
          <span
            className={cn('intro-rise inline-block', outline && 'stroke-char')}
            style={{ ['--d' as string]: delay + i * 45, transitionDelay: outline ? `${i * 35}ms` : undefined }}
          >
            {c}
          </span>
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <section
      ref={ref}
      id="top"
      aria-label="Introduction"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-10 md:pt-32"
    >
      <HeroBackground />

      <motion.div
        style={reduce ? undefined : { scale, opacity, y }}
        className="container-x flex flex-1 origin-top flex-col"
      >
        {/* Meta row */}
        <div className="intro-fade flex flex-wrap items-center gap-x-3 gap-y-2 label-mono text-muted" style={{ ['--d' as string]: 0 }}>
          <span>Based in {profile.locationShort}</span>
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-2 text-fg">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping-slow rounded-full bg-live" />
              <span className="relative size-2 rounded-full bg-live" />
            </span>
            {profile.availability}
          </span>
        </div>

        {/* Name */}
        <h1 className="mt-[clamp(2rem,8vh,5rem)] text-[length:var(--text-display)] leading-[0.86] font-bold tracking-[-0.055em]">
          <span className="sr-only">
            {profile.name}, {profile.title}
          </span>
          <span aria-hidden className="block">
            <NameLine text={profile.firstLine} delay={100} />
            <NameLine text={profile.secondLine} outline delay={300} />
          </span>
        </h1>

        <div className="mt-[clamp(1.75rem,5vh,3.5rem)] grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p
              className="intro-shift max-w-2xl text-[clamp(1.35rem,2.6vw,2.15rem)] leading-[1.18] font-medium tracking-[-0.02em]"
              style={{ ['--d' as string]: 650 }}
            >
              Full-Stack Developer &amp; Founder of{' '}
              <a href={profile.aisynx.url} {...externalProps} className="link-underline">
                AISYNX
              </a>{' '}
              — I build <RotatingWords words={profile.rotatingWords} />
            </p>
            <p
              className="intro-shift mt-5 max-w-xl text-[length:var(--text-lead)] leading-relaxed text-fg/70"
              style={{ ['--d' as string]: 750 }}
            >
              {profile.intro}
            </p>
          </div>

          <div className="intro-fade flex flex-col gap-6 lg:col-span-5 lg:items-end" style={{ ['--d' as string]: 850 }}>
            <a
              href={profile.aisynx.url}
              {...externalProps}
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-line-strong bg-bg/50 py-1.5 pr-4 pl-1.5 backdrop-blur-md transition-colors duration-300 hover:border-accent"
            >
              <span className="grid size-8 place-items-center rounded-full bg-fg/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(profile.aisynx.logo)} alt="" width={20} height={20} className="size-5 object-contain" />
              </span>
              <span className="text-sm">
                Founder <span className="text-muted">@</span> AISYNX
              </span>
              <ArrowUpRight aria-hidden className="size-4 text-accent transition-transform duration-500 group-act:rotate-45" />
            </a>
            <div className="flex flex-wrap items-center gap-3">
              <ButtonLink href="#work" size="lg" magnetic icon={<ArrowDown aria-hidden className="size-4 transition-transform duration-500 group-hover/btn:translate-y-0.5" />}>
                View my work
              </ButtonLink>
              <ButtonLink
                href={asset(profile.resume)}
                download
                variant="ghost"
                size="lg"
                icon={<Download aria-hidden className="size-4" />}
              >
                Download CV
              </ButtonLink>
            </div>
            <div className="flex gap-2">
              {socials.map((s) => (
                <IconLink key={s.label} href={s.href} label={s.label} external={s.icon !== 'mail'}>
                  <SocialIcon name={s.icon} />
                </IconLink>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="intro-fade mt-auto flex items-center justify-between pt-10 label-mono text-muted" style={{ ['--d' as string]: 1000 }}>
          <a href="#about" className="group inline-flex items-center gap-3 hover:text-fg">
            <span className="relative h-10 w-[1px] overflow-hidden bg-line-strong">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-line_1.8s_var(--ease-out)_infinite] bg-accent" />
            </span>
            Scroll
          </a>
          <span className="hidden sm:block">Portfolio — {new Date().getFullYear()}</span>
        </div>
      </motion.div>
    </section>
  );
}
