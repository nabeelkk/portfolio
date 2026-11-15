'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Project, ProjectMedia } from '@/data/types';
import { EASE_OUT, inViewOnce } from '@/lib/animations';
import { cn, hostname, isFilled, pad2 } from '@/lib/utils';
import { TransitionLink } from '../layout/PageTransition';
import { BrowserFrame } from '../ui/BrowserFrame';
import { Gallery } from '../ui/Lightbox';
import { ModuleGrid } from '../ui/ModuleGrid';
import { ProjectLinks } from '../ui/ProjectLinks';
import { SmartImage } from '../ui/SmartImage';
import { SplitText } from '../ui/SplitText';
import { KindBadge, StatusBadge, Tag } from '../ui/Tag';

type Neighbour = { project: Project; media: ProjectMedia };

function Block({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={inViewOnce}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      aria-labelledby={`cs-${index}`}
    >
      <div className="md:col-span-4">
        <span className="label-mono text-accent">{pad2(index)}</span>
        <h2 id={`cs-${index}`} className="mt-2 text-[clamp(1.6rem,3vw,2.4rem)] leading-tight font-semibold tracking-[-0.03em]">
          {title}
        </h2>
      </div>
      <div className="text-[1.05rem] leading-relaxed text-fg/75 md:col-span-8">{children}</div>
    </motion.section>
  );
}

function Bullets({ items, tone = 'accent' }: { items: string[]; tone?: 'accent' | 'dev' }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span aria-hidden className={cn('mt-[0.75em] h-px w-4 shrink-0', tone === 'accent' ? 'bg-accent' : 'bg-dev')} />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function NeighbourLink({ n, dir }: { n: Neighbour; dir: 'prev' | 'next' }) {
  const next = dir === 'next';
  return (
    <TransitionLink
      href={`/projects/${n.project.slug}/`}
      className={cn('group relative flex flex-col gap-3 overflow-hidden py-10 md:py-14', next ? 'items-end text-right' : 'items-start')}
      data-cursor={next ? 'NEXT' : 'PREV'}
    >
      <span className="inline-flex items-center gap-2 label-mono text-muted">
        {!next && <ArrowLeft aria-hidden className="size-3.5" />}
        {next ? 'Next project' : 'Previous project'}
        {next && <ArrowRight aria-hidden className="size-3.5 transition-transform duration-500 group-act:translate-x-1" />}
      </span>
      <span className="text-[clamp(1.8rem,5vw,4.5rem)] leading-[0.95] font-semibold tracking-[-0.045em] transition-colors duration-300 group-act:text-accent">
        {n.project.name}
      </span>
      {/* Hover preview */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 hidden aspect-[16/10] w-56 -translate-y-1/2 overflow-hidden rounded-lg border border-line-strong opacity-0 shadow-2xl transition-[opacity,transform] duration-500 ease-out-expo group-act:opacity-100 lg:block',
          next ? 'left-0 -rotate-3 group-act:rotate-0' : 'right-0 rotate-3 group-act:rotate-0',
        )}
      >
        <SmartImage image={n.media.cover} fallback={{ name: n.project.name, category: n.project.category }} className="object-top" />
      </span>
    </TransitionLink>
  );
}

export function CaseStudy({
  project,
  media,
  prev,
  next,
}: {
  project: Project;
  media: ProjectMedia;
  prev: Neighbour;
  next: Neighbour;
}) {
  const cs = project.caseStudy!;
  const inDev = project.status === 'in-development';
  let n = 0;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {/* Hero */}
      <header className="relative overflow-hidden pt-32 pb-12 md:pt-40">
        <div aria-hidden className="absolute inset-0 -z-10 grid-lines opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div aria-hidden className="absolute -top-1/3 right-[-10%] -z-10 size-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(198,244,50,0.12),transparent_60%)]" />
        <div className="container-x">
          <TransitionLink href="/#work" className="link-underline inline-flex items-center gap-2 label-mono text-muted hover:text-fg">
            <ArrowLeft aria-hidden className="size-3.5" /> All work
          </TransitionLink>
          <div className="mt-10 flex flex-wrap gap-2">
            <StatusBadge status={project.status} />
            <KindBadge kind={project.kind} />
            <Tag tone="accent">{project.category}</Tag>
          </div>
          <SplitText
            as="h1"
            immediate
            delay={0.1}
            segments={[project.name]}
            className="mt-6 max-w-5xl text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.9] font-bold tracking-[-0.05em]"
          />
          <p
            className="intro-shift mt-6 max-w-3xl text-[clamp(1.2rem,2.2vw,1.75rem)] leading-snug text-fg/75"
            style={{ ['--d' as string]: 250 }}
          >
            {project.tagline}
          </p>

          <dl
            className="intro-shift mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4"
            style={{ ['--d' as string]: 320 }}
          >
            {[
              ['Role', project.role],
              ['Type', project.type],
              ['Timeline', isFilled(project.timeline) ? project.timeline : inDev ? 'In development' : project.status === 'live' ? 'Shipped' : 'Completed'],
              ['Links', project.links.live ? hostname(project.links.live) : project.links.github ? 'GitHub' : 'Private / not public yet'],
            ].map(([k, v]) => (
              <div key={k} className="bg-bg p-5">
                <dt className="label-mono text-muted">{k}</dt>
                <dd className="mt-2 text-sm text-fg/90">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-1.5">
              {project.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
            <ProjectLinks project={{ ...project, caseStudy: undefined }} />
          </div>
        </div>
      </header>

      {/* Cover */}
      <div className="container-x">
        <div className="intro-shift" style={{ ['--d' as string]: 350 }}>
          <BrowserFrame url={project.links.live ? hostname(project.links.live) : `${project.slug}.concept`} bodyClassName="aspect-[16/9] bg-card">
            <SmartImage
              image={media.cover}
              priority
              fallback={{ name: project.name, stack: project.stack, category: project.category }}
              className="object-top"
            />
            {media.cover?.concept && (
              <span className="absolute bottom-3 left-3 rounded-full bg-bg/80 px-3 py-1 font-mono text-[10px] tracking-[0.12em] uppercase backdrop-blur-md">
                Design concept · sample data
              </span>
            )}
          </BrowserFrame>
        </div>
      </div>

      {/* Story */}
      <article className="container-x mt-20 md:mt-28">
        <Block index={++n} title="Overview">
          <p>{cs.overview}</p>
        </Block>
        <Block index={++n} title="The challenge">
          <p>{cs.challenge}</p>
        </Block>
        <Block index={++n} title={inDev ? (project.builtSoFar ? 'What I’ve built so far' : 'What I’m building') : 'What I built'}>
          <Bullets items={project.builtSoFar ?? cs.features} />
          {project.planned && (
            <div className="mt-10">
              <p className="mb-4 label-mono text-dev">◐ Planned</p>
              <Bullets items={project.planned} tone="dev" />
            </div>
          )}
          {project.modules && <ModuleGrid modules={project.modules} className="mt-10 max-w-xl" />}
        </Block>
        <Block index={++n} title="Architecture & tech decisions">
          <Bullets items={cs.architecture} />
        </Block>
        <Block index={++n} title={inDev ? 'Status & deployment' : 'Deployment'}>
          <p>{cs.deployment}</p>
        </Block>
        <Block index={++n} title={inDev ? 'Where it stands' : 'Outcome & what I learned'}>
          <p>{cs.outcome}</p>
        </Block>

        {media.gallery.length > 0 && (
          <section aria-labelledby="gallery-title" className="border-t border-line py-12 md:py-16">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 id="gallery-title" className="text-[clamp(1.6rem,3vw,2.4rem)] font-semibold tracking-[-0.03em]">
                Gallery
              </h2>
              {media.gallery.some((g) => g.concept) && (
                <p className="max-w-xs text-right label-mono text-muted normal-case [letter-spacing:0.02em]">
                  Design concepts use sample data. The product is in development.
                </p>
              )}
            </div>
            <Gallery images={media.gallery} name={project.name} />
          </section>
        )}
      </article>

      {/* Prev / next */}
      <nav aria-label="More case studies" className="mt-12 border-t border-line">
        <div className="container-x grid md:grid-cols-2 md:divide-x md:divide-line">
          <div className="md:pr-8">
            <NeighbourLink n={prev} dir="prev" />
          </div>
          <div className="border-t border-line md:border-t-0 md:pl-8">
            <NeighbourLink n={next} dir="next" />
          </div>
        </div>
      </nav>
    </main>
  );
}
