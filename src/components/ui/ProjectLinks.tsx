'use client';

import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FaGithub } from 'react-icons/fa6';
import type { Project } from '@/data/types';
import { cn, externalProps } from '@/lib/utils';
import { TransitionLink } from '../layout/PageTransition';

const pill =
  'group/link inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors duration-300';

/** Live ↗ · GitHub ↗ · Case study →. Buttons without a URL are hidden. */
export function ProjectLinks({ project, className }: { project: Project; className?: string }) {
  const { live, github } = project.links;
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {live && (
        <a
          href={live}
          {...externalProps}
          aria-label={`${project.name}: live site (opens in a new tab)`}
          className={cn(pill, 'border-accent bg-accent text-accent-ink hover:bg-transparent hover:text-accent')}
        >
          Live
          <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 group-hover/link:rotate-45" />
        </a>
      )}
      {github && (
        <a
          href={github}
          {...externalProps}
          aria-label={`${project.name}: source on GitHub (opens in a new tab)`}
          className={cn(pill, 'border-line-strong text-fg hover:border-fg')}
        >
          <FaGithub aria-hidden className="size-4" />
          GitHub
          <ArrowUpRight aria-hidden className="size-4 transition-transform duration-500 group-hover/link:rotate-45" />
        </a>
      )}
      {project.caseStudy && (
        <TransitionLink
          href={`/projects/${project.slug}/`}
          aria-label={`${project.name}: read the case study`}
          className={cn(pill, 'border-line-strong text-fg hover:border-accent hover:text-accent')}
        >
          Case study
          <ArrowRight aria-hidden className="size-4 transition-transform duration-500 group-hover/link:translate-x-1" />
        </TransitionLink>
      )}
    </div>
  );
}
