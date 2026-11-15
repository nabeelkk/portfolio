'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { featuredProjects } from '@/data/projects';
import type { Project, ProjectMedia } from '@/data/types';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { getGsap } from '@/lib/gsap';
import { cn, hostname, pad2 } from '@/lib/utils';
import { TransitionLink } from '../layout/PageTransition';
import { BrowserFrame } from '../ui/BrowserFrame';
import { ModuleGrid } from '../ui/ModuleGrid';
import { ProjectLinks } from '../ui/ProjectLinks';
import { SectionHeading } from '../ui/SectionHeading';
import { SmartImage } from '../ui/SmartImage';
import { KindBadge, StatusBadge, Tag } from '../ui/Tag';
import { TiltCard } from '../ui/TiltCard';

export type MediaMap = Record<string, ProjectMedia>;

/**
 * Must match the `hs` variant in globals.css: horizontal pinned scroll is used on every
 * screen size whenever motion is allowed and the viewport is tall enough to fit a card.
 */
const HSCROLL_QUERY = '(prefers-reduced-motion: no-preference) and (min-height: 600px)';

function ProjectVisual({ project, media }: { project: Project; media?: ProjectMedia }) {
  const cover = media?.cover ?? null;
  const alt = media?.alt ?? null;
  const concept = !!cover?.concept;
  const url = project.links.live ? hostname(project.links.live) : `${project.slug}.concept`;
  const fallback = { name: project.name, stack: project.stack, category: project.category };

  const inner = (
    <BrowserFrame url={url} bodyClassName="aspect-[16/10.5] bg-card">
      <div className="absolute inset-0 overflow-hidden">
        <SmartImage
          image={cover}
          fallback={fallback}
          sizes="(min-width: 1024px) 50vw, 90vw"
          className={cn(
            'object-left-top transition-[transform,opacity] duration-[900ms] ease-out-expo group-act:scale-[1.045]',
            alt && 'group-act:opacity-0',
          )}
        />
        {alt && (
          <SmartImage
            image={alt}
            fallback={fallback}
            className="absolute inset-0 scale-[1.06] object-top opacity-0 transition-[transform,opacity] duration-[900ms] ease-out-expo group-act:scale-100 group-act:opacity-100"
          />
        )}
      </div>
      <span className="shine" aria-hidden />
      {concept && (
        <span className="absolute bottom-2 left-2 z-20 rounded-full bg-bg/80 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-fg/85 uppercase backdrop-blur-md sm:bottom-3 sm:left-3 sm:px-2.5 sm:text-[10px]">
          Design concept · sample data
        </span>
      )}
    </BrowserFrame>
  );

  return (
    <TiltCard className="rounded-xl">
      {project.caseStudy ? (
        <TransitionLink
          href={`/projects/${project.slug}/`}
          data-cursor="VIEW"
          data-activate
          aria-label={`View the ${project.name} case study`}
          className="group block rounded-xl"
        >
          {inner}
        </TransitionLink>
      ) : (
        <div className="group" data-activate>
          {inner}
        </div>
      )}
    </TiltCard>
  );
}

function FeaturedCard({
  project,
  media,
  index,
  total,
}: {
  project: Project;
  media?: ProjectMedia;
  index: number;
  total: number;
}) {
  return (
    <article
      aria-labelledby={`fp-${project.slug}`}
      className={cn(
        'fp-card relative flex w-full min-w-0 shrink-0 flex-col gap-8 rounded-3xl border border-line bg-bg-elev/90 p-5 sm:p-8',
        // Horizontal mode on phones / tablets: compact card sized to the viewport
        'hs:w-[86vw] sm:hs:w-[70vw] md:hs:w-[62vw] max-lg:hs:gap-4 max-lg:hs:p-5',
        // Desktop
        'lg:h-[min(76vh,760px)] lg:w-full lg:flex-row lg:items-stretch lg:gap-10 lg:p-10 lg:hs:w-[min(82vw,1180px)]',
      )}
    >
      {/* Info */}
      <div className="flex min-w-0 flex-col gap-5 max-lg:hs:gap-3 lg:w-[40%] lg:shrink-0">
        <div className="flex items-start justify-between gap-4 max-lg:hs:hidden">
          <span className="font-mono text-[clamp(2.5rem,5vw,4.5rem)] leading-none font-medium tracking-[-0.06em] text-accent">
            {pad2(index + 1)}
          </span>
          <span className="label-mono pt-2 text-muted">
            {pad2(index + 1)} / {pad2(total)}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="hidden font-mono text-sm text-accent max-lg:hs:inline">
            {pad2(index + 1)}/{pad2(total)}
          </span>
          <StatusBadge status={project.status} />
          <KindBadge kind={project.kind} />
        </div>
        <div className="min-w-0">
          <p className="label-mono text-accent">{project.category}</p>
          <h3
            id={`fp-${project.slug}`}
            className="mt-2 text-[clamp(1.75rem,3.6vw,3.4rem)] leading-[0.95] font-semibold tracking-[-0.04em] break-words"
          >
            {project.name}
          </h3>
          <p className="mt-3 text-[1.02rem] leading-relaxed text-fg/70 max-lg:hs:mt-2 max-lg:hs:line-clamp-2 max-lg:hs:text-[0.95rem] [@media(max-height:680px)]:max-lg:hs:hidden [@media(max-height:760px)]:lg:line-clamp-3">
            {project.tagline}
          </p>
        </div>
        {project.modules ? (
          <ModuleGrid modules={project.modules} className="hidden lg:flex [@media(max-height:780px)]:lg:hidden" />
        ) : (
          <ul className="hidden flex-col gap-2 text-sm text-fg/70 lg:flex [@media(max-height:720px)]:lg:hidden">
            {project.highlights.slice(0, 4).map((h) => (
              <li key={h} className="flex gap-3">
                <span aria-hidden className="mt-[0.65em] h-px w-3 shrink-0 bg-accent" />
                {h}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-auto flex flex-col gap-5 max-lg:hs:gap-3">
          <div className="flex flex-wrap gap-1.5 max-lg:hs:max-h-[1.75rem] max-lg:hs:overflow-hidden [@media(max-height:760px)]:max-lg:hs:hidden">
            {project.stack.slice(0, 6).map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
          <ProjectLinks project={project} />
        </div>
      </div>

      {/* Visual */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-4">
        <ProjectVisual project={project} media={media} />
        {project.modules && <ModuleGrid modules={project.modules} className="lg:hidden max-lg:hs:hidden" />}
        {project.statusNote && (
          <p className="label-mono leading-relaxed text-muted normal-case [letter-spacing:0.02em] max-lg:hs:hidden [@media(max-height:760px)]:lg:hidden">
            <span className="text-dev">◐</span> {project.statusNote}
          </p>
        )}
      </div>
    </article>
  );
}

/**
 * Motion allowed + tall enough viewport (any width): the card track pins and scrolls
 * horizontally. Reduced motion or very short viewports (e.g. landscape phones): a
 * vertical stack of cards.
 */
export function FeaturedProjects({ media }: { media: MediaMap }) {
  const pinWrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const total = featuredProjects.length;

  useEffect(() => {
    const { gsap, ScrollTrigger } = getGsap();
    ScrollTrigger.config({ ignoreMobileResize: true });
    const mm = gsap.matchMedia();
    mm.add(HSCROLL_QUERY, () => {
      const el = track.current;
      const wrap = pinWrap.current;
      if (!el || !wrap) return;
      const distance = () => Math.max(0, el.scrollWidth - document.documentElement.clientWidth);
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
          },
        },
      });
      // Depth: cards scale up as they reach the centre.
      el.querySelectorAll<HTMLElement>('.fp-card').forEach((card) => {
        gsap.fromTo(
          card,
          { scale: 0.92, opacity: 0.55 },
          {
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: 'left 100%',
              end: 'left 30%',
              scrub: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="relative overflow-hidden py-24 md:py-32 hs:pb-0 lg:hs:py-0">
      <div className="container-x lg:hs:hidden">
        <SectionHeading
          id="work-title"
          index="03"
          label="Selected work"
          title={['Products I’ve ', { text: 'shipped', serif: true }, ' & am building.']}
          className="hs:mb-6 md:hs:mb-10"
        />
      </div>

      <div
        ref={pinWrap}
        className="hs:flex hs:h-[100svh] hs:flex-col hs:justify-center hs:pt-[5rem] hs:pb-3 lg:hs:pt-[5.25rem] lg:hs:pb-4"
      >
        <div
          ref={track}
          className="flex flex-col gap-6 px-[var(--gutter)] hs:w-max hs:flex-row hs:items-center hs:gap-5 md:gap-8 lg:hs:gap-10"
        >
          {/* Intro panel (desktop) */}
          <div className="hidden w-[min(34vw,460px)] shrink-0 flex-col gap-8 lg:hs:flex">
            <span className="label-mono text-accent">03 — Selected work</span>
            <motion.h2
              className="text-[clamp(3rem,5.4vw,6rem)] leading-[0.92] font-semibold tracking-[-0.045em]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewOnce}
              transition={{ duration: 0.9, ease: EASE_OUT }}
              aria-hidden
            >
              Products I’ve <span className="serif-i">shipped</span> &amp; am building.
            </motion.h2>
            <p className="max-w-sm text-fg/70">
              ERPs, SaaS, mobile apps and commerce. Live work is marked live; products still in
              development show design concepts with sample data.
            </p>
            <span className="label-mono text-muted">Scroll →</span>
          </div>

          {featuredProjects.map((p, i) => (
            <FeaturedCard key={p.slug} project={p} media={media[p.slug]} index={i} total={total} />
          ))}
          <div aria-hidden className="hidden w-[2vw] shrink-0 hs:block lg:w-[8vw]" />
        </div>

        {/* Progress */}
        <div aria-hidden className="container-x mt-5 hidden hs:flex hs:items-center hs:gap-4 lg:mt-8">
          <span className="label-mono text-muted lg:hidden">Scroll ↓</span>
          <div className="h-px flex-1 bg-line">
            <div ref={bar} className="h-px origin-left scale-x-0 bg-accent" />
          </div>
        </div>
      </div>
    </section>
  );
}
